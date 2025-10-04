import { Client } from "discord.js";
import IChannelService from "../../../Application/Services/Discord/IChannelService.ts";
import { ChannelService } from "../../../Infrastructure/Services/Discord/ChannelServices.ts";

export default function ChannelServiceFabricator(form: { discordClient: Client }): IChannelService {
    const { discordClient } = form;
    return new ChannelService(discordClient);
}