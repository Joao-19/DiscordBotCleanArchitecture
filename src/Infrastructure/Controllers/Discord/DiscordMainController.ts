import { Events, Client } from "discord.js";
import BaseDiscordController from "./BaseDiscordController.ts";
import { DiscordCommand } from "../../../Domain/Discord/Entities/DiscordCommand.ts";
import {IUpdateDiscordCommandListUseCase} from "../../../Domain/UseCases/Discord/Commands/IUpdateDiscordCommandListUseCase.ts";
import {IGetUploadedCommandsUseCase} from "../../../Domain/UseCases/Discord/Commands/IGetUploadedCommandsUseCase.ts";
import GetDiscordCommandListUseCase from "../../../Application/UseCases/Discord/Commands/GetDiscordCommandListUseCase.ts";
import DiscordCommandsController from "./BaseDiscordController.ts";
import DiscordMessageWatcherController from "./BaseDiscordController.ts";
import { Ok, Result } from "ts-results";
import ICommandBridgeService from "../../../Application/Services/Discord/ICommandBridgeService.ts";

export default class DiscordMainController implements BaseDiscordController {

    discordBotCommands: DiscordCommand[];

    private readonly commandBridgeService: ICommandBridgeService;
    private readonly updateDiscordCommandListUseCase: IUpdateDiscordCommandListUseCase;
    private readonly getUploadedCommandsUseCase: IGetUploadedCommandsUseCase;
    private readonly discordCommandsController: DiscordCommandsController;
    private readonly discordMessageWatcherController: DiscordMessageWatcherController;
    readonly discordClient: Client;

    constructor({
        discordClient,
        commandBridgeService,
        updateDiscordCommandListUseCase,
        DiscordCommandsController,
        discordMessageWatcherController,
        getUploadedCommandsUseCase
    }: {
        discordClient: Client,
        commandBridgeService: ICommandBridgeService,
        updateDiscordCommandListUseCase: IUpdateDiscordCommandListUseCase,
        DiscordCommandsController: DiscordCommandsController,
        discordMessageWatcherController: DiscordMessageWatcherController,
        getUploadedCommandsUseCase: IGetUploadedCommandsUseCase
    }) {
        this.discordClient = discordClient;
        this.discordBotCommands = []; // Initialize here
        this.commandBridgeService = commandBridgeService;
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

        return Ok(undefined);
    }

    async #onBotStart() {
        try {
            const isCommandsUpdated = await this.#isCommandListUpdated();            
            if (!isCommandsUpdated) {
                await this.updateDiscordCommandListUseCase.execute({commands: this.commandBridgeService.discordCommands}); // Pass current commands for update
            }
            console.log("Discord bot commands are updated!");
        } catch (e) {
            console.error("Error on bot start", e);
        }
    }

    async #isCommandListUpdated() {
        const uploadedCommands = await this.getUploadedCommandsUseCase.execute();
        if (uploadedCommands.err) {
            console.error("Failed to fetch uploaded commands:", uploadedCommands.val);
            return false;
        }
        const uploadedCommandNames = uploadedCommands.val.map(command => command.getName());

        this.discordBotCommands = this.commandBridgeService.discordCommands;
        const registeredCommandsNames = this.discordBotCommands.map(command => command.getName());

        const allUploadedAreRegistered = uploadedCommandNames.every((name: string) => {
            return registeredCommandsNames.includes(name);
        });

        const noCommandsToRemove = registeredCommandsNames.every((name: string) => {
            return uploadedCommandNames.includes(name)
        });

        return allUploadedAreRegistered && noCommandsToRemove;
    }
}