import { DiscordCommand } from "../../../Domain/Discord/Entities/DiscordCommand.js";
import { Commands } from "../../../Domain/Discord/Entities/DiscordCommand.js";


interface IDiscordCommandRepository {

    getUploadedCommands(): Promise<Commands>;

    getCommands(): Promise<Commands>;

    updateCommands(commands: DiscordCommand[]): Promise<void>;
}

export default IDiscordCommandRepository;