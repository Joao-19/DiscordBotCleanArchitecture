import { Events } from "discord.js";
import BaseDiscordController from "./BaseDiscordController.js";
import { Commands } from "../../../Domain/Discord/Entities/DiscordCommand.js";

export default class DiscordMainController extends BaseDiscordController {
    /**
    /**
     * @type {import('../../../Domain/Discord/Entities/DiscordCommand.js').Commands}
     */
    /**
     * @type {import('../../../Domain/Discord/Entities/DiscordCommand.js').Commands}
     */
    discordBotCommands;

    /**
     * @param {object} params
     * @param {import('discord.js').Client} params.discordClient - The Discord client instance.
     * @param {import('../../Services/Discord/CommandBridgeService.js').default} params.commandBridgeService - The CommandBridgeService instance.
     * @param {import('../../../Application/UseCases/Discord/Commands/GetDiscordCommandListUseCase.js').default} params.getDiscordCommandListUseCase - Use case to get Discord command list.
     * @param {import('../../../Application/UseCases/Discord/Commands/UpdateDiscordCommandListUseCase.js').default} params.updateDiscordCommandListUseCase - Use case to update Discord command list.
     * @param {import('./DiscordCommandsController.js').default} params.DiscordCommandsController - Controller for Discord slash commands.
     * @param {import('./DiscordMessageWatcherController.js').default} params.discordMessageWatcherController - Controller for Discord message commands.
     * @param {import('../../../Application/UseCases/Discord/Commands/GetUploadedCommandsUseCase.js').default} params.getUploadedCommandsUseCase - Use case to get uploaded commands.
     */

    constructor({
        discordClient,
        commandBridgeService,
        getDiscordCommandListUseCase,
        updateDiscordCommandListUseCase,
        DiscordCommandsController,
        discordMessageWatcherController,
        getUploadedCommandsUseCase
    }) {
        super({ discordClient });
        this.discordBotCommands = new Commands({ commands: [] }); // Initialize here
        this.commandBridgeService = commandBridgeService;
        this.getDiscordCommandListUseCase = getDiscordCommandListUseCase;
        this.updateDiscordCommandListUseCase = updateDiscordCommandListUseCase;
        this.getUploadedCommandsUseCase = getUploadedCommandsUseCase;

        this.DiscordCommandsController = DiscordCommandsController;
        this.discordMessageWatcherController = discordMessageWatcherController;
    }

    async initialize() {
        await this.commandBridgeService.initializeCommands();
        await this.#onBotStart();

        this.DiscordCommandsController.registerEvents();
        this.discordMessageWatcherController.registerEvents();

        this.client.on(Events.ClientReady, async readyClient => {
            console.log(`Logged in as ${readyClient.user.tag}!`);
        });
    }

    async #onBotStart() {
        try {
            const isCommandsUpdated = await this.#isCommandListUpdated();
            if (!isCommandsUpdated) {
                await this.updateDiscordCommandListUseCase.execute(this.discordBotCommands.getAllCommands()); // Pass current commands for update
            }
            console.log("Discord bot commands are updated!");
        } catch (e) {
            console.error("Error on bot start:", e);
        }
    }

    async #isCommandListUpdated() {
        const uploadedCommands = await this.getUploadedCommandsUseCase.execute();
        const uploadedCommandNames = uploadedCommands.getAllCommandNames();

        const registeredBotCommands = await this.getDiscordCommandListUseCase.execute();
        this.discordBotCommands = registeredBotCommands;
        
        const registeredCommandsNames = registeredBotCommands.getAllCommandNames();

        const uploadedCommandNamesSet = new Set(uploadedCommandNames);
        const registeredCommandsNamesSet = new Set(registeredCommandsNames);

        const allUploadedAreRegistered = uploadedCommandNames.every((/** @type {string} */ name) =>
            registeredCommandsNamesSet.has(name)
        );

        const noCommandsToRemove = registeredCommandsNames.every((/** @type {string} */ name) =>
            uploadedCommandNamesSet.has(name)
        );

        return allUploadedAreRegistered && noCommandsToRemove;
    }

}