import Results, { Result } from "ts-results";
import ICommandBridgeService from "../../../Domain/Services/Discord/ICommandBridgeService.js";
import BaseDiscordController from "./BaseDiscordController.js";
import { Client, Events } from "discord.js";

export default class DiscordMessageWatcherController implements BaseDiscordController {
    commandBridgeService: ICommandBridgeService;
    discordClient: Client;
    prefix: string;

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