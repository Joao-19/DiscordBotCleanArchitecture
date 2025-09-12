import { Events, Client, Message } from "discord.js";
import BaseDiscordController from "./BaseDiscordController.js";
import { DiscordCommand, Commands } from "../../../Domain/Discord/Entities/DiscordCommand.js";
import IUpdateDiscordCommandListUseCase from "../../../Domain/UseCases/Discord/Commands/IUpdateDiscordCommandListUseCase.js";
import IGetUploadedCommandsUseCase from "../../../Domain/UseCases/Discord/Commands/IGetUploadedCommandsUseCase.js";
import GetDiscordCommandListUseCase from "../../../Application/UseCases/Discord/Commands/GetDiscordCommandListUseCase.js";
import DiscordCommandsController from "./BaseDiscordController.js";
import DiscordMessageWatcherController from "./BaseDiscordController.js";
import Results, { Result } from "ts-results";
import ICommandBridgeService from "../../../Domain/Services/Discord/ICommandBridgeService.js";

export default class DiscordMainController implements BaseDiscordController {
    /**
     * @type {Commands}
     */
    discordBotCommands: Commands;

    private readonly commandBridgeService: ICommandBridgeService;
    private readonly getDiscordCommandListUseCase: GetDiscordCommandListUseCase;
    private readonly updateDiscordCommandListUseCase: IUpdateDiscordCommandListUseCase;
    private readonly getUploadedCommandsUseCase: IGetUploadedCommandsUseCase;
    private readonly discordCommandsController: DiscordCommandsController;
    private readonly discordMessageWatcherController: DiscordMessageWatcherController;
    readonly discordClient: Client;


    /**
     * @param {object} params
     * @param {import('discord').Client} params.discordClient - The Discord client instance.
     * @param {import('../../Services/Discord/CommandBridgeService').default} params.commandBridgeService - The CommandBridgeService instance.
     * @param {import('../../../Application/UseCases/Discord/Commands/GetDiscordCommandListUseCase').default} params.getDiscordCommandListUseCase - Use case to get Discord command list.
     * @param {import("../../../Domain/UseCases/IUpdateDiscordCommandListUseCase").default} params.updateDiscordCommandListUseCase - Use case to update Discord command list.
     * @param {import('./DiscordCommandsController').default} params.DiscordCommandsController - Controller for Discord slash commands.
     * @param {import('./DiscordMessageWatcherController').default} params.discordMessageWatcherController - Controller for Discord message commands.
     * @param {import('../../../Domain/UseCases/IGetUploadedCommandsUseCase').default} params.getUploadedCommandsUseCase - Use case to get uploaded commands.
     */
    constructor({
        discordClient,
        commandBridgeService,
        getDiscordCommandListUseCase,
        updateDiscordCommandListUseCase,
        DiscordCommandsController,
        discordMessageWatcherController,
        getUploadedCommandsUseCase
    }: {
        discordClient: Client,
        commandBridgeService: any,
        getDiscordCommandListUseCase: GetDiscordCommandListUseCase,
        updateDiscordCommandListUseCase: IUpdateDiscordCommandListUseCase,
        DiscordCommandsController: DiscordCommandsController,
        discordMessageWatcherController: DiscordMessageWatcherController,
        getUploadedCommandsUseCase: IGetUploadedCommandsUseCase
    }) {
        this.discordClient = discordClient;
        this.discordBotCommands = new Commands({ commands: [] }); // Initialize here
        this.commandBridgeService = commandBridgeService;
        this.getDiscordCommandListUseCase = getDiscordCommandListUseCase;
        this.updateDiscordCommandListUseCase = updateDiscordCommandListUseCase;
        this.getUploadedCommandsUseCase = getUploadedCommandsUseCase;

        this.discordCommandsController = DiscordCommandsController;
        this.discordMessageWatcherController = discordMessageWatcherController;
    }

    
    registerEvents(): Result<void, Error> {
        this.commandBridgeService.initializeCommands();
        this.#onBotStart();

        const initializeCommandsPromise = [
            this.discordCommandsController.registerEvents(),
            this.discordMessageWatcherController.registerEvents(),
        ];

        this.discordClient.on(Events.ClientReady, async readyClient => {
            console.log(`Logged in as ${readyClient.user.tag}!`);
        });

        return Results.Ok(undefined);
    }

    async #onBotStart() {
        try {
            const isCommandsUpdated = await this.#isCommandListUpdated();
            if (!isCommandsUpdated) {
                await this.updateDiscordCommandListUseCase.execute(this.discordBotCommands.getAllCommands()); // Pass current commands for update
            }
            console.log("Discord bot commands are updated!");
        } catch (e) {
            console.error("Error on bot start", e);
        }
    }

    async #isCommandListUpdated() {
        const uploadedCommands = await this.getUploadedCommandsUseCase.execute();
        const uploadedCommandNames = uploadedCommands.getAllCommandNames();

        const registeredBotCommands = await this.getDiscordCommandListUseCase.execute();
        this.discordBotCommands = registeredBotCommands.val;
        const registeredCommandsNames = this.discordBotCommands.getAllCommandNames();

        const allUploadedAreRegistered = uploadedCommandNames.every((name: string) => {
            return registeredCommandsNames.includes(name);
        });

        const noCommandsToRemove = registeredCommandsNames.every((name: string) => {
            return uploadedCommandNames.includes(name)
        });

        return allUploadedAreRegistered && noCommandsToRemove;
    }
}