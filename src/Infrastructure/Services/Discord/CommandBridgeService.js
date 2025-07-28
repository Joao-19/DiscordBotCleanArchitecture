import PingCommandUseCaseFabricator from "../../Fabricators/UseCases/Discord/PingCommandUseCaseFabricator.js";
import UnrecognizedMessageError from "../../../Domain/Error/Message/UnrecognizedMessageError.js";
import { Commands } from "../../../Domain/Discord/Entities/DiscordCommand.js";
import IDiscordCommandRepository from "../../../Domain/Discord/Repositories/IDiscordCommandRepository.js";


export default class CommandBridgeService {

    /**
     * @type {import("discord.js").Client}
     */
    discordClient;
    /**
     * @type {IDiscordCommandRepository}
     */
    discordCommandRepository;
    /**
     * @type {string}
     */
    shortcutIdentifier;
    /**
     * @typedef {object} CommandHandlerEntry
     * @property {string} commandName - The name of the command.
     * @property {object} useCase - The UseCase instance for the command.
     * @property {function(object): Promise<void>} useCase.execute - The execute method of the UseCase.
     */

    /**
     * @type {CommandHandlerEntry[]}
     */
    discordBotHandlersCommands = [];
    /**
    *@type { Commands }
    */
    discordBotCommands = new Commands({ commands: [] });

    /**
     * @param {{discordClient: import("discord.js").Client, discordCommandRepository: IDiscordCommandRepository, shortcutIdentifier: string}} options
     * @param { object } options
     * @param {import("discord.js").Client} options.discordClient - The Discord client to use for handling commands.
     * @param {IDiscordCommandRepository} options.discordCommandRepository - The repository to use for retrieving and updating commands.
     * @param {string} options.shortcutIdentifier - The shortcut identifier for commands (e.g. prefix).
     */
    constructor({
        discordClient,
        discordCommandRepository,
        shortcutIdentifier,
    }) {
        this.discordClient = discordClient;
        this.discordCommandRepository = discordCommandRepository;
        this.shortcutIdentifier = shortcutIdentifier;
    }

    /**
     * Executes the command based on the provided command name and form.
     * @param {object} params - The parameters for the command execution.
     * @param {string} params.commandName - The name of the command to be executed.
     * @param {object} params.form - The form data to be passed to the command handler.
     * @param {import('discord.js').Message | undefined} [params.form.message] - The message object if it's a message command.
     * @param {import('discord.js').ChatInputCommandInteraction | undefined} [params.form.interaction] - The interaction object if it's a slash command.
     */
    executeCommand({ commandName, form }) {
        const serializedCommandName = this.#serializeCommandName(commandName);
        const commandHandler = this.discordBotHandlersCommands.find(handler => handler.commandName === serializedCommandName);
        if (commandHandler) {
            commandHandler.useCase.execute(form);
        } else {
            throw new UnrecognizedMessageError(`Command '${commandName}' not found.`);
        }
    }

    /**
     * Initializes and registers command handlers based on commands from the repository.
     * @returns {Promise<void>}
     */
    async initializeCommands() {
        this.discordBotCommands = await this.discordCommandRepository.getCommands();
        
        const allAvailableHandlers = [
            {
                commandName: "ping",
                useCase: PingCommandUseCaseFabricator.create({ discordClient: this.discordClient })
            },
        ];

        this.discordBotHandlersCommands = /** @type {CommandHandlerEntry[]} */ (
            this.discordBotCommands.getAllCommands().map(command => {
                const matchingHandler = allAvailableHandlers.find(handler => handler.commandName === command.getName());
                if (!matchingHandler) {
                    console.warn(`No matching handler found for command: ${command.getName()}`);
                    return null; // Or throw an error, depending on desired strictness
                }
                return matchingHandler;
            }).filter(Boolean)
        );
        
        console.log('CommandBridgeService initialized with handlers:', this.discordBotHandlersCommands.map(h => h.commandName));
    }

    /**
    *
    * @param {string} commandName
    * @returns {string}
    */
    #serializeCommandName(commandName) {
        const isAShortcut = commandName.includes(this.shortcutIdentifier);
        if (isAShortcut) {
            return commandName.replace(this.shortcutIdentifier, "");
        }
        return commandName;
    }

}