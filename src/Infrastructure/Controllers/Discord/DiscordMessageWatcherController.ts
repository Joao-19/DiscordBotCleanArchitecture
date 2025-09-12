import Results, { Result } from "ts-results";
import ICommandBridgeService from "../../../Domain/Services/Discord/ICommandBridgeService.js";
import BaseDiscordController from "./BaseDiscordController.js";
import { Client, Events } from "discord.js";

/**
 * Controller for handling Discord message-based commands (e.g., using a prefix).
 * @extends BaseDiscordController
 */
export default class DiscordMessageWatcherController implements BaseDiscordController {
    /** @type {any} */
    commandBridgeService: ICommandBridgeService;
    /** @type {import('discord.js').Client} */
    discordClient: Client;
    /** @type {string} */
    prefix;

    /**
     * @param {object} params
     * @param {import('discord.js').Client} params.discordClient - The Discord client instance.
     * @param {any} params.commandBridgeService - The CommandBridgeService instance.
     * @param {string} params.shortcutIdentifier - The shortcut identifier (prefix) for message commands.
     */
    constructor(form: { discordClient: Client, commandBridgeService: any, shortcutIdentifier: string }) {
        const { discordClient, commandBridgeService, shortcutIdentifier } = form;
        this.discordClient = discordClient;
        this.commandBridgeService = commandBridgeService;
        this.prefix = shortcutIdentifier;
    }

    registerEvents(): Result<void, Error> {

        this.discordClient.on(Events.MessageCreate, async (message) => {
            // Handle message creation events here
            if (message.author.bot || !message.content.startsWith(this.prefix)) return;
            console.log(`Message received: ${message.content}`);

            const args = message.content.slice(this.prefix.length).trim().split(/ +/);
            const commandName = args.shift(); // shift() can return undefined

            if (!commandName) return; // Handle empty command name

            const lowerCaseCommandName = commandName.toLowerCase();

            try {
                await this.commandBridgeService.executeCommand({commandName: lowerCaseCommandName, data: { message }});
            } catch (e) {
                console.error(`Error executing command ${lowerCaseCommandName}:`, e);
                await message.reply('There was an error trying to execute that command.');
            }

        });

        return Results.Ok(undefined);
    }
}