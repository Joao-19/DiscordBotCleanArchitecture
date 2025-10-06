import ErrorMessage from "../../../Error/Discord/Message/ErrorMessage.ts";
import UseCase from "../DiscordUseCase.ts";
import UnknownError from "../../../Error/UnknownError.ts";
import UseCaseReplyResult from "@/Domain/Discord/UseCaseReplyResult.ts";

export interface EditChannelUseCaseForm {
    guildId: string;
    canal: string;
    novo_nome: string;
}

export type IEditChannelUseCaseResult = UseCaseReplyResult;
export type IEditChannelUseCaseErrors = ErrorMessage | UnknownError;
export type IEditChannelUseCase = UseCase<EditChannelUseCaseForm, IEditChannelUseCaseResult>