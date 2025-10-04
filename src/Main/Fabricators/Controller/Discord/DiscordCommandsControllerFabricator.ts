import { Client } from "discord.js";
import ICommandBridgeService from "../../../../Application/Services/Discord/ICommandBridgeService.ts";
import DiscordCommandsController from "../../../../Infrastructure/Controllers/Discord/DiscordCommandsController.ts";

class DiscordCommandsControllerFabricator {

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