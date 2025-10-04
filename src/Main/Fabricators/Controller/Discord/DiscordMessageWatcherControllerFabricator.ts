import envConfig from "../../../../../env.config.js";
import { Client } from "discord.js"
import ICommandBridgeService from "../../../../Application/Services/Discord/ICommandBridgeService.ts";
import DiscordMessageWatcherController from "../../../../Infrastructure/Controllers/Discord/DiscordMessageWatcherController.ts";

class DiscordMessageWatcherControllerFabricator {
    static create(form:{discordClient: Client, commandBridgeService: ICommandBridgeService}) {
        const { discordClient, commandBridgeService } = form;
        return new DiscordMessageWatcherController({
            discordClient,
            commandBridgeService,
            shortcutIdentifier: envConfig.discord.commands.shortcutIdentifier
        });
    }
}

export default DiscordMessageWatcherControllerFabricator;