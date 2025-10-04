import { ChatInputCommandInteraction, Message } from "discord.js";
import { Result } from "ts-results";
import { DiscordCommand } from "../../../Domain/Discord/Entities/DiscordCommand.ts";

export interface UseCaseCommandHandlerForm {
   message?: Message,
   interaction?: ChatInputCommandInteraction,
}

export interface ExecuteCommandBridgeForm {
    commandName: string,
    data: { message?: Message, interaction?: ChatInputCommandInteraction }
}
export default interface ICommandBridgeService {
    discordCommands: DiscordCommand[];

    executeCommand(form: ExecuteCommandBridgeForm): Promise<Result<void, Error>>;
    initializeCommands(): Promise<void>;
    isCommandHandlerAvailable(commandName: DiscordCommand): boolean
}