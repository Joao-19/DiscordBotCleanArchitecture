import IChannelService from "@/Application/Services/Discord/IChannelService.ts";
import { EditChannelUseCaseForm, IEditChannelUseCase, IEditChannelUseCaseErrors, IEditChannelUseCaseResult } from "@/Domain/UseCases/Discord/Channels/IEditChannelUseCase";
import { Result, Ok } from "ts-results/result.js";

export default class EditChannelUseCase implements IEditChannelUseCase {

    constructor(
        readonly channelService: IChannelService
    ) { }

    async execute(form: EditChannelUseCaseForm): Promise<Result<IEditChannelUseCaseResult, IEditChannelUseCaseErrors>> {
        const { guildId, canal:channel, novo_nome: newName } = form;
        const replyMessage = "Canal Editado com sucesso!";
        const result = await this.channelService.edit(guildId, channel, newName);
        if (result.err) return result;
        return Ok({ replyMessage });
    }
}