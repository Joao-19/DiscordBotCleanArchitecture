import ErrorMessage from "../../../Error/Discord/Message/ErrorMessage.ts";
import UseCase from "../DiscordUseCase.ts";
import UnknownError from "../../../Error/UnknownError.ts";
import UseCaseReplyResult from "@/Domain/Discord/UseCaseReplyResult.ts";

export interface CreateChannelUseCaseForm {
    guildId: string;
    nome: string;
    tipo: number
    categoria?: string;
}

export type ICreateChannelUseCaseResult = UseCaseReplyResult;
export type ICreateChannelUseCaseErrors = ErrorMessage | UnknownError;
export type ICreateChannelUseCase = UseCase<CreateChannelUseCaseForm, ICreateChannelUseCaseResult>