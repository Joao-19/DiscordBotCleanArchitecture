import BaseError from "../../../Error/BaseError.ts";
import ErrorMessage from "../../../Error/Discord/Message/ErrorMessage.ts";
import UseCase from "../DiscordUseCase.ts";
import { Commands } from "../../../Discord/Entities/DiscordCommand.ts";

export type GetDiscordCommandListUseCaseForm = void;
export type IGetDiscordCommandListUseCaseResult = Commands;
export type IGetDiscordCommandListUseCaseErrors = ErrorMessage | BaseError;
export type IGetDiscordCommandListUseCase =  UseCase<GetDiscordCommandListUseCaseForm, IGetDiscordCommandListUseCaseResult, IGetDiscordCommandListUseCaseErrors>;
