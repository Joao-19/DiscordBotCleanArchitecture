import BaseDiscordController from "./BaseDiscordController.js";
import { Events } from "discord.js";

/**
 * Controller for handling Discord slash commands (interactions).
 * @extends BaseDiscordController
 */
export default class DiscordCommandsController extends BaseDiscordController {

    /** @type {any} */
    #commandBridgeService;

    /**
     * @param {object} params
     * @param {import('discord.js').Client} params.discordClient - The Discord client instance.
     * @param {import('../../Services/Discord/CommandBridgeService.js').default} params.commandBridgeService - The CommandBridgeService instance.
     */
    constructor({ discordClient, commandBridgeService }) {
        super({ discordClient });
        this.#commandBridgeService = commandBridgeService;
    }

    /**
     * Registers event listeners for Discord interactions.
     * Listens for `InteractionCreate` events and dispatches slash commands to the CommandBridgeService.
     * @returns {void}
     */
    registerEvents() {

        this.client.on(Events.InteractionCreate, async interaction => {
            try {
                if (!interaction.isChatInputCommand()) return;

                /** @type {import('discord.js').ChatInputCommandInteraction} */
                const chatInputInteraction = interaction; // Type assertion

                console.log("Command interaction received: ", chatInputInteraction.commandName);
                await this.#commandBridgeService.executeCommand({commandName: chatInputInteraction.commandName, form: { interaction: chatInputInteraction }});
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
    }
}