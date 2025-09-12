import { Client } from "discord.js";
import DiscordCommandsController from "../../../Controllers/Discord/DiscordCommandsController.js";
import ICommandBridgeService from "../../../../Domain/Services/Discord/ICommandBridgeService.js";

/**
 * Fabricator for DiscordCommandsController.
 */
class DiscordCommandsControllerFabricator {

    /**
     * Creates an instance of DiscordCommandsController.
     * @param {object} form - The constructor parameters.
     * @param {import('discord.js').Client} form.discordClient - The Discord client instance.
     * @param {import('../../../../Domain/Services/Discord/ICommandBridgeService').default} form.commandBridgeService - The CommandBridgeService instance.
     * @returns {DiscordCommandsController}
     */
    static create(form: {
        discordClient: Client,
        commandBridgeService: ICommandBridgeService
    }) {
        const { discordClient, commandBridgeService } = form;
        return new DiscordCommandsController({
            discordClient,
            commandBridgeService
        });
    }
}

export default DiscordCommandsControllerFabricator;