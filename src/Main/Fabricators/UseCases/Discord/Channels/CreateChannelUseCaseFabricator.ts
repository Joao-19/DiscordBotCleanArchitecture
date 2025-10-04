import CreateChannelUseCase from "../../../../../Application/UseCases/Discord/Channels/CreateChannelUseCase.ts";
import { Client } from "discord.js";
import ChannelServiceFabricator from "../../../Services/ChannelServiceFabricator.ts";

function CreateChannelUseCaseFabricator(form: { discordClient: Client }) {
    const { discordClient } = form;
    const channelService = ChannelServiceFabricator({ discordClient });
    return new CreateChannelUseCase(channelService);
}

export default CreateChannelUseCaseFabricator;