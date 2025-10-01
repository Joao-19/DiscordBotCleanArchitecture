import { Client } from "discord.js";
import DiscordCommandsController from "../../../Controllers/Discord/DiscordCommandsController.js";
import ICommandBridgeService from "../../../../Domain/Services/Discord/ICommandBridgeService.js";

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