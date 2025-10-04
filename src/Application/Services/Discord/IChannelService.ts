import UnknownError from "@/Domain/Error/UnknownError";
import { Result } from "ts-results";

export default interface IChannelService {
    create(guildId: string, channelName: string): Promise<Result<void, UnknownError>>;
}