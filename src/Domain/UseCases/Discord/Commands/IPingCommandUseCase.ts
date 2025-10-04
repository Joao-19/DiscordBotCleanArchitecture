import ErrorMessage from "../../../Error/Discord/Message/ErrorMessage.ts";
import UseCase from "../DiscordUseCase.ts";
import BaseError from "../../../Error/BaseError.ts";
import UseCaseReplyResult from "@/Domain/Discord/UseCaseReplyResult.ts";

export type PingComandUseCaseForm = void;
export type IPingCommandUseCaseResult = UseCaseReplyResult;
export type IPingComandUseCaseErrors = ErrorMessage | BaseError;
export type IPingCommandUseCase = UseCase<PingComandUseCaseForm, IPingCommandUseCaseResult>;