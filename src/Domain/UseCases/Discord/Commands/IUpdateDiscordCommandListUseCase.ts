import BaseError from "../../../../Domain/Error/BaseError.ts";
import ErrorMessage from "../../../../Domain/Error/Discord/Message/ErrorMessage.ts";
import { Commands, DiscordCommand } from "../../../../Domain/Discord/Entities/DiscordCommand.ts";
import UseCase from "../DiscordUseCase.ts";

export interface IUpdateDiscordCommandListUseCaseForm  {
    commands: DiscordCommand[];
};
export type IUpdateDiscordCommandListUseCaseResult = void;
export type IUpdateDiscordCommandListUseCaseErrors = ErrorMessage | BaseError
export type IUpdateDiscordCommandListUseCase =  UseCase<IUpdateDiscordCommandListUseCaseForm, IUpdateDiscordCommandListUseCaseResult, IUpdateDiscordCommandListUseCaseErrors>