import ErrorMessage from "../../../Error/Discord/Message/ErrorMessage.js";
import UseCase from "../DiscordUseCase.js";
import { Message, ChatInputCommandInteraction} from "discord.js";
import BaseError from "../../../Error/BaseError.js";

export interface PingComandUseCaseForm {
    message?: Message;
    interaction?: ChatInputCommandInteraction;
}

export type IPingCommandUseCaseResult = void;
export type IPingComandUseCaseErrors = ErrorMessage | BaseError
export type IPingCommandUseCase =  UseCase<PingComandUseCaseForm, IPingCommandUseCaseResult>