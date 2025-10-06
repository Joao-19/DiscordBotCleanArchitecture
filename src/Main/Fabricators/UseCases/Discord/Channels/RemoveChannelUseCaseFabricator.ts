import { Client } from "discord.js";
import ChannelServiceFabricator from "../../../Services/ChannelServiceFabricator.ts";
import RemoveChannelUseCase from "@/Application/UseCases/Discord/Channels/RemoveChannelUseCase.ts";

function RemoveChannelUseCaseFabricator(form: { discordClient: Client }) {
    const { discordClient } = form;
    const channelService = ChannelServiceFabricator({ discordClient });
    return new RemoveChannelUseCase(channelService);
}

export default RemoveChannelUseCaseFabricator;