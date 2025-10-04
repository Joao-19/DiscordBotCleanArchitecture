import ErrorMessage from "../../../Error/Discord/Message/ErrorMessage.ts";
import UseCase from "../DiscordUseCase.ts";
import UnknownError from "../../../Error/UnknownError.ts";

export interface CreateChannelUseCaseForm {
    nome: string;
    guildId: string;
}

export type ICreateChannelUseCaseResult = { replySuccess: string };
export type ICreateChannelUseCaseErrors = ErrorMessage | UnknownError;
export type ICreateChannelUseCase =  UseCase<CreateChannelUseCaseForm, ICreateChannelUseCaseResult>