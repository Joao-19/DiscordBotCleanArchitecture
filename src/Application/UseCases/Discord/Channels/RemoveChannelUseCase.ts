import IChannelService from "@/Application/Services/Discord/IChannelService";
import { IRemoveChannelUseCase, RemoveChannelUseCaseForm, IRemoveChannelUseCaseResult, IRemoveChannelUseCaseErrors } from "@/Domain/UseCases/Discord/Channels/IRemoveChannelUseCase";
import { Result, Ok } from "ts-results";

export default class RemoveChannelUseCase implements IRemoveChannelUseCase {

    constructor(
        readonly channelService: IChannelService
    ) { }

    async execute(form: RemoveChannelUseCaseForm): Promise<Result<IRemoveChannelUseCaseResult, IRemoveChannelUseCaseErrors>> {
        const { guildId, canal: channel } = form;
        const replyMessage = "Canal Removido com sucesso!";
        const result = await this.channelService.remove(guildId, channel);
        if (result.err) return result;
        return Ok({ replyMessage });
    }
}