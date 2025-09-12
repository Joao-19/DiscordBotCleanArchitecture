import BaseError from "../../../../Domain/Error/BaseError.js";
import ErrorMessage from "../../../../Domain/Error/Discord/Message/ErrorMessage.js";
import { Commands, DiscordCommand } from "../../../../Domain/Discord/Entities/DiscordCommand.js";
import UseCase from "../DiscordUseCase.js";

export interface IUpdateDiscordCommandListUseCaseForm  {
    commands: DiscordCommand[];
};
export type IUpdateDiscordCommandListUseCaseResult = void;
export type IUpdateDiscordCommandListUseCaseErrors = ErrorMessage | BaseError
export type IUpdateDiscordCommandListUseCase =  UseCase<IUpdateDiscordCommandListUseCaseForm, IUpdateDiscordCommandListUseCaseResult, IUpdateDiscordCommandListUseCaseErrors>