import IChannelService from "@/Application/Services/Discord/IChannelService.ts";
import { ICreateChannelUseCase, CreateChannelUseCaseForm, ICreateChannelUseCaseResult, ICreateChannelUseCaseErrors } from "@/Domain/UseCases/Discord/Channels/ICreateChannelUseCase.ts";
import { Result, Ok } from "ts-results/result.js";

export default class CreateChannelUseCase implements ICreateChannelUseCase {

    constructor(
        readonly channelService: IChannelService
    ) {}

    async execute(form: CreateChannelUseCaseForm): Promise<Result<ICreateChannelUseCaseResult, ICreateChannelUseCaseErrors>> {
        const { nome:name, guildId } = form;
        const replySuccess = "Canal Criado com sucesso!";
        const result = await this.channelService.create(guildId, name);
        if (result.err) return result;
        return Ok({ replySuccess });
    }
}