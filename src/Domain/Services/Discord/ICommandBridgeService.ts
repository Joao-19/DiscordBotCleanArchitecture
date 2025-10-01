import { ChatInputCommandInteraction, Message } from "discord.js";
import { Result } from "ts-results";
import { DiscordCommand } from "../../../Domain/Discord/Entities/DiscordCommand.js";
import UseCase from "../../../Domain/UseCases/Discord/DiscordUseCase.js";

export interface UseCaseCommandHandlerForm {
   message?: Message,
   interaction?: ChatInputCommandInteraction,
}

export interface CommandHandler {
    commandName: string;
    useCase: UseCase<any, any>;
}

export interface ExecuteCommandBridgeForm {
    commandName: string,
    data: { message?: Message, interaction?: ChatInputCommandInteraction }
}
export default interface ICommandBridgeService {
    executeCommand(form: ExecuteCommandBridgeForm): Promise<Result<void, Error>>;
    initializeCommands(): Promise<void>;
    isCommandHandlerAvailable(commandName: DiscordCommand): boolean
}