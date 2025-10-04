import BaseError from "../../../../Domain/Error/BaseError.ts";
import ErrorMessage from "../../../../Domain/Error/Discord/Message/ErrorMessage.ts";
import { DiscordCommandSerialized } from "../../../Discord/Entities/DiscordCommand.ts";
import UseCase from "../DiscordUseCase.ts";

export type IGetUploadedCommandsUseCaseForm  = void;
export type IGetUploadedCommandsUseCaseResult = DiscordCommandSerialized[];
export type IGetUploadedCommandsUseCaseErrors = ErrorMessage | BaseError
export type IGetUploadedCommandsUseCase =  UseCase<IGetUploadedCommandsUseCaseForm, IGetUploadedCommandsUseCaseResult>