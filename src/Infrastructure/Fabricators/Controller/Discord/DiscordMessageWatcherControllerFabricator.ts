import DiscordMessageWatcherController from "../../../Controllers/Discord/DiscordMessageWatcherController.ts";
import envConfig from "../../../../../env.config.js";
import { Client } from "discord.js"
import ICommandBridgeService from "../../../../Domain/Services/Discord/ICommandBridgeService.ts";

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