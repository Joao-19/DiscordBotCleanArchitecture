import { Ok, Err, Result } from "ts-results/result.js";
import IDiscordCommandRepository from "@/Application/Interfaces/Repositories/IDiscordCommandRepository.ts";
import ICommandBridgeService, { ExecuteCommandBridgeForm } from "@/Application/Services/Discord/ICommandBridgeService.ts";
import { DiscordCommand } from "@/Domain/Discord/Entities/DiscordCommand.ts";
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
            const commandResult = await commandHandler.handler.execute({...optionsForm, ...data});
            if (commandResult.err) return commandResult;
            if ("replySuccess" in commandResult.val) {
               successResult = commandResult.val.replySuccess;
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
            const subCommandResult = await subCommandHandler.handler.execute(data);
            if (subCommandResult.err) return subCommandResult;
            if ("replySuccess" in subCommandResult.val) {
               successResult = subCommandResult.val.replySuccess;
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
    private extractOptionsDataFromInteraction(command: DiscordCommand, interaction: ChatInputCommandInteraction): Object {
        const findOptions = command.options;
        let extractedOptions = {
            guildId: interaction.guildId, // default parameter for use cases can manage guild related data
        };
        const extractedOptionNames = findOptions.map(option => option.name);
        extractedOptionNames.forEach(name => {
            // Todo in the future, handle different option types (not only string), others not tested.
            const value = interaction.options.getString(name);
            if (value) {
                extractedOptions = {
                    ...extractedOptions,
                    [name]: value
                }
            }
        });
        console.log("Extracted Options:",extractedOptions);
        
        return extractedOptions;
    }

}