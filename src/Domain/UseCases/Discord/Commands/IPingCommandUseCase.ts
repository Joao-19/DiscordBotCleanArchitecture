import ErrorMessage from "../../../Error/Discord/Message/ErrorMessage.ts";
import UseCase from "../DiscordUseCase.ts";
import { Message, ChatInputCommandInteraction} from "discord.js";
import BaseError from "../../../Error/BaseError.ts";

export interface PingComandUseCaseForm {
    message?: Message;
    interaction?: ChatInputCommandInteraction;
}

export type IPingCommandUseCaseResult = void;
export type IPingComandUseCaseErrors = ErrorMessage | BaseError
export type IPingCommandUseCase =  UseCase<PingComandUseCaseForm, IPingCommandUseCaseResult>