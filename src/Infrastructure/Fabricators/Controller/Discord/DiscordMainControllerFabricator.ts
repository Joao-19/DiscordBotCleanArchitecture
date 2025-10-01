import DiscordMainController from "../../../Controllers/Discord/DiscordMainController.js";
import GetDiscordCommandListUseCaseFabricator from "../../../Fabricators/UseCases/Discord/GetDiscordCommandListUseCaseFabricator.js";
import UpdateDiscordCommandListUseCaseFabricator from "../../../Fabricators/UseCases/Discord/UpdateDiscordCommandListUseCaseFabricator.js";
import DiscordCommandsControllerFabricator from "./DiscordCommandsControllerFabricator.js";
import DiscordMessageWatcherControllerFabricator from "./DiscordMessageWatcherControllerFabricator.js";
import DiscordCommandRepositoryFabricator from "../../../Fabricators/Repositories/Discord/DiscordCommandRepositoryFabricator.js";
import GetUploadedCommandsUseCaseFabricator from "../../../Fabricators/UseCases/Discord/GetUploadedDiscordCommandUseCaseFabricator.js";
import CommandBridgeService from '../../../Services/Discord/CommandBridgeService.js'; // Keep the import for runtime
import { Client } from "discord.js";
import envConfig from "../../../../../env.config.js";

class DiscordMainControllerFabricator {

    static create({discordClient}: {discordClient: Client}) {

        
        const discordCommandRepositoryInstance = DiscordCommandRepositoryFabricator.create();

        // Used for correlation commands with use cases
        const commandBridgeService = new CommandBridgeService({
            discordClient,
            discordCommandRepository: discordCommandRepositoryInstance,
            shortcutIdentifier: envConfig.discord.commands.shortcutIdentifier
        });

        // Unic instances of use cases for system boot
        const getDiscordCommandListUseCase = GetDiscordCommandListUseCaseFabricator.create(discordCommandRepositoryInstance);
        const getUploadedCommandsUseCase = GetUploadedCommandsUseCaseFabricator.create(discordCommandRepositoryInstance);

        const updateDiscordCommandListUseCase = UpdateDiscordCommandListUseCaseFabricator.create(discordCommandRepositoryInstance);
        const DiscordCommandsController = DiscordCommandsControllerFabricator.create({
            discordClient,
            commandBridgeService,
        });
        
        const discordMessageWatcherController = DiscordMessageWatcherControllerFabricator.create({
            discordClient,
            commandBridgeService
        });

        return new DiscordMainController({
            discordClient,
            commandBridgeService,
            getDiscordCommandListUseCase,
            updateDiscordCommandListUseCase,
            DiscordCommandsController,
            discordMessageWatcherController,
            getUploadedCommandsUseCase
        });
    }
}

export default DiscordMainControllerFabricator;