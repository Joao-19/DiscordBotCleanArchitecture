import Results,{ Ok, Result } from "ts-results";
import ICommandBridgeService from "../../../Application/Services/Discord/ICommandBridgeService.ts";
import BaseDiscordController from "./BaseDiscordController.ts";
import { Client, Events } from "discord.js";

export default class DiscordCommandsController implements BaseDiscordController {

    commandBridgeService: ICommandBridgeService;
    discordClient: Client;

    constructor(form: { discordClient: Client, commandBridgeService: ICommandBridgeService }) {
        const { discordClient, commandBridgeService } = form;
        this.discordClient = discordClient;
        this.commandBridgeService = commandBridgeService;
    }

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

        return Ok(undefined);
    }
}