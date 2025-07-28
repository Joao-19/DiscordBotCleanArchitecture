import DiscordMessageWatcherController from "../../../Controllers/Discord/DiscordMessageWatcherController.js";
import envConfig from "./../../../../../env.config.js";

class DiscordMessageWatcherControllerFabricator {
    static create({discordClient, commandBridgeService}) {
        return new DiscordMessageWatcherController({
            discordClient,
            commandBridgeService,
            shortcutIdentifier: envConfig.discord.commands.shortcutIdentifier
        });
    }
}

export default DiscordMessageWatcherControllerFabricator;