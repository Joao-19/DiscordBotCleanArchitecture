import { Ok, Err, Result } from "ts-results/result.js";
import IDiscordCommandRepository from "@/Application/Interfaces/Repositories/IDiscordCommandRepository.ts";
import ICommandBridgeService, { ExecuteCommandBridgeForm } from "@/Application/Services/Discord/ICommandBridgeService.ts";
import { CommandOptionType, DiscordCommand } from "@/Domain/Discord/Entities/DiscordCommand.ts";
import { ErrorTag } from "@/Domain/Error/BaseError.ts";
import CommandNotFoundError from "@/Domain/Error/Discord/Message/CommandNotFoundError.ts";
import { Client, ChatInputCommandInteraction, Message, MessageFlags } from "discord.js";

export default class CommandBridgeService implements ICommandBridgeService {

    discordClient: Client;
    discordCommandRepository: IDiscordCommandRepository;
    shortcutIdentifier;
    discordCommands: DiscordCommand[];

    constructor(form: {
        discordClient: Client,
        discordCommandRepository: IDiscordCommandRepository,
        shortcutIdentifier: string,
        discordCommands: DiscordCommand[]
    }) {
        const { discordClient, discordCommandRepository, shortcutIdentifier, discordCommands } = form;
        this.discordClient = discordClient;
        this.discordCommandRepository = discordCommandRepository;
        this.shortcutIdentifier = shortcutIdentifier;
        this.discordCommands = discordCommands;
    }

    async executeCommand(form: ExecuteCommandBridgeForm): Promise<Result<void, Error>> {
        const { commandName, data } = form;

        const serializedCommandName = this.serializeCommandName(commandName);
        const commandHandler = this.discordCommands.find(command => command.name === serializedCommandName);
        let successResult: string = "Comando executado com sucesso!";

        if (commandHandler && commandHandler.handler) {
            let optionsForm: Object | undefined = undefined;
            if (data.interaction && commandHandler.options.length > 0) {
                optionsForm = this.extractOptionsDataFromInteraction(commandHandler, data.interaction);
            }
            const commandResult = await commandHandler.handler.execute({ ...optionsForm, ...data });
            if (commandResult.err) return commandResult;
            if ("replyMessage" in commandResult.val) {
                successResult = commandResult.val.replyMessage;
            }
        } else if (commandHandler && commandHandler.subCommands.length > 0) {
            const subCommandName = data.interaction?.options.getSubcommand(false) || data.message?.content.split(" ")[1];
            if (!subCommandName) {
                const commandNotFoundError = new CommandNotFoundError({
                    interaction: data.message || data.interaction,
                    message: `Subcommand not specified for command '${commandName}'.`,
                    tag: ErrorTag.DISCORD_COMMAND
                });
                await commandNotFoundError.reply();
                return Err(commandNotFoundError);
            }
            const subCommandHandler = commandHandler.subCommands.find(subCommand => subCommand.name === subCommandName);
            if (!subCommandHandler || !subCommandHandler.handler) {
                const commandNotFoundError = new CommandNotFoundError({
                    interaction: data.message || data.interaction,
                    message: `Subcommand '${subCommandName}' not found for command '${commandName}'.`,
                    tag: ErrorTag.DISCORD_COMMAND
                });
                await commandNotFoundError.reply();
                return Err(commandNotFoundError);
            }
            let optionsForm: Object | undefined = undefined;
            if (data.interaction && subCommandHandler.options.length > 0) {
                optionsForm = this.extractOptionsDataFromInteraction(subCommandHandler, data.interaction);
            }
            const subCommandResult = await subCommandHandler.handler.execute({ ...optionsForm, ...data });
            if (subCommandResult.err) return subCommandResult;
            if ("replyMessage" in subCommandResult.val) {
                successResult = subCommandResult.val.replyMessage;
            }
        } else {
            const commandNotFoundError = new CommandNotFoundError({
                interaction: data.message || data.interaction,
                message: `Command '${commandName}' not found.`,
                tag: ErrorTag.DISCORD_COMMAND
            });
            await commandNotFoundError.reply();
            return Err(commandNotFoundError);
        }
        const someInteraction = data.interaction || data.message;
        if (someInteraction) await this.replyCommand(successResult, someInteraction);
        return Ok(undefined);
    }

    async initializeCommands(): Promise<void> {
        this.discordCommands = this.discordCommands;
        await this.discordCommandRepository.updateCommands(this.discordCommands);
    }

    isCommandHandlerAvailable(discordCommand: DiscordCommand): boolean {
        const commandName = discordCommand.getName();
        return this.discordCommands.some(discordCommand => discordCommand.name === commandName);
    }


    private serializeCommandName(commandName: string): string {
        const isAShortcut = commandName.includes(this.shortcutIdentifier);
        if (isAShortcut) {
            return commandName.replace(this.shortcutIdentifier, "");
        }
        return commandName;
    }

    private async replyCommand(message: string, interaction: ChatInputCommandInteraction | Message): Promise<void> {
        if (interaction instanceof ChatInputCommandInteraction) {
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: message, flags: MessageFlags.Ephemeral });
            } else {
                await interaction.reply({ content: message, flags: MessageFlags.Ephemeral });
            }
        } else if (interaction instanceof Message) {
            await interaction.reply({ content: message });
        }
    }

    // Todo implement with message in the future
    private extractOptionsDataFromInteraction(command: DiscordCommand, interaction: ChatInputCommandInteraction): object {
        const extractedOptions: { [key: string]: any } = {
            // Parâmetros padrão que todo UseCase pode precisar
            guildId: interaction.guildId
        };

        // Itera sobre as opções que você DEFINIU para este comando
        for (const definedOption of command.options) {
            const optionName = definedOption.name;

            // Use um switch no TIPO que você mesmo definiu na sua entidade de domínio
            switch (definedOption.type) {
                case CommandOptionType.CHANNEL: {
                    // ✅ Pega o canal diretamente com o tipo correto!
                    const channelValue = interaction.options.getChannel(optionName);
                    if (channelValue) {
                        extractedOptions[optionName] = channelValue;
                    }
                    break;
                }

                case CommandOptionType.STRING: {
                    const stringValue = interaction.options.getString(optionName);
                    if (stringValue) {
                        extractedOptions[optionName] = stringValue;
                    }
                    break;
                }

                case CommandOptionType.USER: {
                    const userValue = interaction.options.getUser(optionName);
                    if (userValue) {
                        extractedOptions[optionName] = userValue;
                    }
                    break;
                }

                // ... adicione outros casos para INTEGER, ROLE, BOOLEAN, etc.

                default: {
                    const genericOption = interaction.options.get(optionName);
                    if (genericOption?.value) {
                        extractedOptions[optionName] = genericOption.value;
                    }
                    break;
                }
            }
        }
        return extractedOptions;
    }

}