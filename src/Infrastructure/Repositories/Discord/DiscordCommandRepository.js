import { REST, Routes } from "discord.js";
import IDiscordCommandRepository from "../../../Domain/Discord/Repositories/IDiscordCommandRepository.js";
import DiscordCommand, { Commands } from "../../../Domain/Discord/Entities/DiscordCommand.js";


/**
 * @typedef {object} DiscordAPICommand
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {number} type
 */

/**
 * @extends IDiscordCommandRepository
 */
class DiscordCommandRepository extends IDiscordCommandRepository {

    discordValidateCommandsNameRegex = new RegExp("^[\\-_'\\p{L}\\p{N}\\p{sc=Deva}\\p{sc=Thai}]{1,32}$", "u");

    /**
     * @param {object} params
     * @param {string} params.clientId - The Discord bot client ID.
     * @param {string} params.secretToken - The Discord bot secret token.
     */
    constructor({clientId, secretToken}) {
        super();
        this.rest = new REST({ version: '10' }).setToken(secretToken);
        this.clientId = clientId
    }

    /**
     * Retrieves uploaded Discord commands from the Discord API and filters them against registered commands.
     * @returns {Promise<Commands>} A promise that resolves to a Commands object containing valid uploaded commands.
     */
    async getUploadedCommands() {
        /** @type {DiscordAPICommand[]} */
        const uploadedCommands = /** @type {DiscordAPICommand[]} */ (await this.rest.get(Routes.applicationCommands(this.clientId)));
        console.log("Uploaded commands:", uploadedCommands.length);

        const botRegisteredCommands = await this.getCommands();
        const registeredCommandNames = botRegisteredCommands.getAllCommandNames();

        const registeredCommandNamesSet = new Set(registeredCommandNames);
        const validCommandsUploaded = uploadedCommands.filter(command => registeredCommandNamesSet.has(command.name));

        const serializedCommands = validCommandsUploaded.map(command => {
            return new DiscordCommand(command.id, command.name, command.description, command.type, command.name); // Use command.name as handler
        });
        return new Commands({commands: serializedCommands});
    }

    /**
     * Updates Discord commands on the Discord API.
     * @param {import("../../../Domain/Discord/Entities/DiscordCommand.js").default[]} commands - An array of DiscordCommand instances to update.
     * @returns {Promise<void>} A promise that resolves when the commands are updated.
     */
    async updateCommands(commands) {
        const formattedCommands = commands.map(command => ({
            name: command.getName().toLowerCase(),
            description: command.getDescription(),
            type: command.getType(), // Include type for Discord API
        }));

        const testCommandNames = formattedCommands.map(command => command.name);
        const invalidCommandNames = testCommandNames.filter(commandName => !this.discordValidateCommandsNameRegex.test(commandName));
        if (invalidCommandNames.length > 0) {
            throw new Error(`Invalid command names: ${invalidCommandNames.join(', ')}`);
        }
        console.log("Updated commands:\n", testCommandNames.join('\n'));
        await this.rest.put(Routes.applicationCommands(this.clientId), { body: formattedCommands });
    }

    /**
     * Retrieves a list of hard-coded Discord commands.
     * @returns {Promise<Commands>} A promise that resolves to a Commands object containing hard-coded commands.
     */
    async getCommands() {
        
        // MockComands, for testing, in the future can use a database or others.
        const hardCodedCommands = [
            new DiscordCommand("1", "Ping", "Comando de teste, que sera respondido com pong.", 1, "pingHandler"),
            new DiscordCommand("2", "Criar_Canal", "Criar um canal de texto.", 1, "createChatHandler"),
            new DiscordCommand("3", "Remover_Canal", "Remover um canal de texto.", 1, "removeChannelHandler"),
            new DiscordCommand("4", "Atualizar_Canal", "Atualizar um canal de texto.", 1, "updateChannelHandler"),
        ];
        
        const commands = new Commands({commands: hardCodedCommands});
        return commands;
    }
}

export default DiscordCommandRepository;