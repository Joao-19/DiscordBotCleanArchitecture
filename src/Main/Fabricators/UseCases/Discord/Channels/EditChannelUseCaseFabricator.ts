import { Client } from "discord.js";
import ChannelServiceFabricator from "../../../Services/ChannelServiceFabricator.ts";
import EditChannelUseCase from "@/Application/UseCases/Discord/Channels/EditChannelUseCase.ts";

function EditChannelUseCaseFabricator(form: { discordClient: Client }) {
    const { discordClient } = form;
    const channelService = ChannelServiceFabricator({ discordClient });
    return new EditChannelUseCase(channelService);
}

export default EditChannelUseCaseFabricator;