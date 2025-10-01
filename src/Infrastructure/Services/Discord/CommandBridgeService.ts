import PingCommandUseCaseFabricator from "../../Fabricators/UseCases/Discord/PingCommandUseCaseFabricator.js";
import { Commands, DiscordCommand } from "../../../Domain/Discord/Entities/DiscordCommand.js";
import IDiscordCommandRepository from "../../../Application/Interfaces/Repositories/IDiscordCommandRepository.js";
import Results, { Result } from "ts-results";
import { Client, ChatInputCommandInteraction, Message } from "discord.js";
import { ErrorTag } from "../../../Domain/Error/BaseError.js";
import ICommandBridgeService, {CommandHandler, ExecuteCommandBridgeForm} from "../../../Domain/Services/Discord/ICommandBridgeService.js";
import CommandNotFoundError from "../../../Domain/Error/Discord/Message/CommandNotFoundError.js";

export default class CommandBridgeService implements ICommandBridgeService {


    discordClient: Client;
    discordCommandRepository: IDiscordCommandRepository;
    shortcutIdentifier;
    discordBotHandlersCommands: CommandHandler[] = [];
    discordBotCommands = new Commands({ commands: [] });

    constructor(form: {
        discordClient: Client,
        discordCommandRepository: IDiscordCommandRepository,
        shortcutIdentifier: string,
    }) {
        const { discordClient, discordCommandRepository, shortcutIdentifier } = form;
        this.discordClient = discordClient;
        this.discordCommandRepository = discordCommandRepository;
        this.shortcutIdentifier = shortcutIdentifier;
    }

    async executeCommand(form: ExecuteCommandBridgeForm): Promise<Result<void, Error>> {
        const { commandName, data } = form;
        const serializedCommandName = this.serializeCommandName(commandName);
        const commandHandler = this.discordBotHandlersCommands.find(handler => handler.commandName === serializedCommandName);
        if (commandHandler) {
            const commandResult = await commandHandler.useCase.execute(data);
            if (commandResult.err) return commandResult;
        } else {
            const commandNotFoundError = new CommandNotFoundError({
                    interaction: data.message || data.interaction,
                    message: `Command '${commandName}' not found.`,
                    tag: ErrorTag.DISCORD_COMMAND
            });
            await commandNotFoundError.reply();
            return Results.Err(commandNotFoundError);
        }
        return Results.Ok(undefined);
    }

    async initializeCommands(): Promise<void> {
        this.discordBotCommands = await this.discordCommandRepository.getCommands();

        const allAvailableHandlers: CommandHandler[] = [
            {
                commandName: "ping",
                useCase: PingCommandUseCaseFabricator.create({ discordClient: this.discordClient })
            },
        ];


        const unnavailableCommands: string[] = [];

        this.discordBotHandlersCommands = (
            this.discordBotCommands.getAllCommands().map((authorizedCommand: DiscordCommand) => {
                const matchingHandler = allAvailableHandlers.find(handler => handler.commandName === authorizedCommand.getName());
                if (!matchingHandler) {
                    unnavailableCommands.push(authorizedCommand.getName());
                    return false; // Or throw an error, depending on desired strictness
                }
                return matchingHandler;
            }).filter((commandHandler: CommandHandler | false): commandHandler is CommandHandler => !!commandHandler)
        );

        console.log('CommandBridgeService initialized with handlers:', this.discordBotHandlersCommands.map(h => h.commandName).join('\n'));
        console.warn('Unnavailable commands:\n', unnavailableCommands.join('\n'));
    }

    isCommandHandlerAvailable(discordCommand: DiscordCommand): boolean {
        const commandName = discordCommand.getName();
        return this.discordBotHandlersCommands.some(handler => handler.commandName === commandName);
    }


    private serializeCommandName(commandName: string): string {
        const isAShortcut = commandName.includes(this.shortcutIdentifier);
        if (isAShortcut) {
            return commandName.replace(this.shortcutIdentifier, "");
        }
        return commandName;
    }

}