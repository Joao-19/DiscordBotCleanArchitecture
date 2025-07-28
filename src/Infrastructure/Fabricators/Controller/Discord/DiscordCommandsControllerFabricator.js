import DiscordCommandsController from "../../../Controllers/Discord/DiscordCommandsController.js";

/**
 * Fabricator for DiscordCommandsController.
 */
class DiscordCommandsControllerFabricator {
    /**
     * Creates an instance of DiscordCommandsController.
     * @param {object} params
     * @param {import('discord.js').Client} params.discordClient - The Discord client instance.
     * @param {any} params.commandBridgeService - The CommandBridgeService instance.
     * @returns {DiscordCommandsController}
     */
    static create({
        discordClient,
        commandBridgeService
    }) {
        return new DiscordCommandsController({
            discordClient,
            commandBridgeService
        });
    }
}

export default DiscordCommandsControllerFabricator;