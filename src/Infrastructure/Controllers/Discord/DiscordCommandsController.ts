import Results,{ Result } from "ts-results";
import ICommandBridgeService from "../../../Domain/Services/Discord/ICommandBridgeService.js";
import BaseDiscordController from "./BaseDiscordController.js";
import { Client, Events } from "discord.js";

/**
 * Controller for handling Discord slash commands (interactions).
 * @extends BaseDiscordController
 */
export default class DiscordCommandsController implements BaseDiscordController {

    /** @type {any} */
    commandBridgeService: ICommandBridgeService;
    discordClient: Client;

    /**
     * @param {object} params
     * @param {import('discord.js').Client} params.discordClient - The Discord client instance.
     * @param {import('../../Services/Discord/CommandBridgeService.js').default} params.commandBridgeService - The CommandBridgeService instance.
     */
    constructor(form: { discordClient: Client, commandBridgeService: ICommandBridgeService }) {
        const { discordClient, commandBridgeService } = form;
        this.discordClient = discordClient;
        this.commandBridgeService = commandBridgeService;
    }

    /**
     * Registers event listeners for Discord interactions.
     * Listens for `InteractionCreate` events and dispatches slash commands to the CommandBridgeService.
     * @returns {void}
     */
    registerEvents(): Result<void, Error> {

        this.discordClient.on(Events.InteractionCreate, async interaction => {
            try {
                if (!interaction.isChatInputCommand()) return;
                console.log("Command interaction received: ", interaction.commandName);
                await this.commandBridgeService.executeCommand({commandName: interaction.commandName, data: { interaction: interaction }});
            } catch (e) {
                console.error(`Error handling command interaction:`, e); // Removed commandName from log as it might not exist on generic interaction
                // Check if interaction is replyable before attempting to reply
                if (interaction.isRepliable()) {
                    if (interaction.replied || interaction.deferred) {
                        await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
                    } else {
                        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
                    }
                } else {
                    console.error("Interaction was not replyable.");
                }
            }
        });

        return Results.Ok(undefined);
    }
}