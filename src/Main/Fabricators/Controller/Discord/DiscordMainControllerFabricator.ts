import DiscordCommandsControllerFabricator from "./DiscordCommandsControllerFabricator.ts";
import DiscordMessageWatcherControllerFabricator from "./DiscordMessageWatcherControllerFabricator.ts";
import DiscordCommandRepositoryFabricator from "../../../Fabricators/Repositories/Discord/DiscordCommandRepositoryFabricator.ts";
import { Client } from "discord.js";
import envConfig from "../../../../../env.config.js";
import DiscordMainController from "../../../../Infrastructure/Controllers/Discord/DiscordMainController.ts";
import CommandBridgeService from "../../../../Infrastructure/Services/Discord/CommandBridgeService.ts";
import GetUploadedCommandsUseCaseFabricator from "../../../../Main/Fabricators/UseCases/Discord/Commands/GetUploadedDiscordCommandUseCaseFabricator.ts";
import UpdateDiscordCommandListUseCaseFabricator from "../../../../Main/Fabricators/UseCases/Discord/Commands/UpdateDiscordCommandListUseCaseFabricator.ts";
import CreateCommands from "../../../Config/DiscordBotCommands.ts";

class DiscordMainControllerFabricator {

    static create({discordClient}: {discordClient: Client}) {

        const discordCommandRepositoryInstance = DiscordCommandRepositoryFabricator(discordClient);

        // Used for correlation commands with use cases
        const commandBridgeService = new CommandBridgeService({
            discordClient,
            discordCommandRepository: discordCommandRepositoryInstance,
            shortcutIdentifier: envConfig.discord.commands.shortcutIdentifier,
            discordCommands: CreateCommands(discordClient)
        });

        // Unic instances of use cases for system boot
        // const getDiscordCommandListUseCase = GetDiscordCommandListUseCaseFabricator.create(discordCommandRepositoryInstance);
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
            updateDiscordCommandListUseCase,
            DiscordCommandsController,
            discordMessageWatcherController,
            getUploadedCommandsUseCase
        });
    }
}

export default DiscordMainControllerFabricator;