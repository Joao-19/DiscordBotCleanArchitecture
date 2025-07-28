import BaseDiscordController from "./BaseDiscordController.js";
import { Events } from "discord.js";

/**
 * Controller for handling Discord message-based commands (e.g., using a prefix).
 * @extends BaseDiscordController
 */
export default class DiscordMessageWatcherController extends BaseDiscordController {
    /** @type {any} */
    #commandBridgeService;
    /** @type {string} */
    #prefix;

    /**
     * @param {object} params
     * @param {import('discord.js').Client} params.discordClient - The Discord client instance.
     * @param {any} params.commandBridgeService - The CommandBridgeService instance.
     * @param {string} params.shortcutIdentifier - The shortcut identifier (prefix) for message commands.
     */
    constructor({ discordClient, commandBridgeService, shortcutIdentifier }) {
        super({ discordClient });
        this.#commandBridgeService = commandBridgeService;
        this.#prefix = shortcutIdentifier;
    }

    registerEvents() {

        // this event is fired when a message is created, maybe is exaustive
        // TODO Discorver if this can be filter to optimize

        this.client.on(Events.MessageCreate, async (message) => {
            // Handle message creation events here

            console.log(`Message received: ${message.content}`);

            if (message.author.bot || !message.content.startsWith(this.#prefix)) return;

            const args = message.content.slice(this.#prefix.length).trim().split(/ +/);
            const commandName = args.shift(); // shift() can return undefined

            if (!commandName) return; // Handle empty command name

            const lowerCaseCommandName = commandName.toLowerCase();

            try {
                await this.#commandBridgeService.executeCommand({commandName: lowerCaseCommandName, form: { message }});
            } catch (e) {
                console.error(`Error executing command ${lowerCaseCommandName}:`, e);
                await message.reply('There was an error trying to execute that command.');
            }

        });
    }
}