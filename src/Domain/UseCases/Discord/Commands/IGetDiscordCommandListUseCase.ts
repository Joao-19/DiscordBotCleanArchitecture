import BaseError from "../../../Error/BaseError.js";
import ErrorMessage from "../../../Error/Discord/Message/ErrorMessage.js";
import UseCase from "../DiscordUseCase.js";
import { Commands } from "../../../Discord/Entities/DiscordCommand.js";

export type GetDiscordCommandListUseCaseForm = void;
export type IGetDiscordCommandListUseCaseResult = Commands;
export type IGetDiscordCommandListUseCaseErrors = ErrorMessage | BaseError;
export type IGetDiscordCommandListUseCase =  UseCase<GetDiscordCommandListUseCaseForm, IGetDiscordCommandListUseCaseResult, IGetDiscordCommandListUseCaseErrors>;
