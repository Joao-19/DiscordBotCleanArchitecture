import BaseError from "../../../../Domain/Error/BaseError.js";
import ErrorMessage from "../../../../Domain/Error/Discord/Message/ErrorMessage.js";
import { Commands } from "../../../Discord/Entities/DiscordCommand.js";
import UseCase from "../DiscordUseCase.js";

export type IGetUploadedCommandsUseCaseForm  = void;
export type IGetUploadedCommandsUseCaseResult = Commands;
export type IGetUploadedCommandsUseCaseErrors = ErrorMessage | BaseError
export type IGetUploadedCommandsUseCase =  UseCase<IGetUploadedCommandsUseCaseForm, IGetUploadedCommandsUseCaseResult, IGetUploadedCommandsUseCaseErrors>