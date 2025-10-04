import { DiscordCommandSerialized, Commands, DiscordCommand } from "@/";

interface IDiscordCommandRepository {
    getUploadedCommands(): Promise<DiscordCommandSerialized[]>;

    getCommands(): Promise<Commands>;

    updateCommands(commands: DiscordCommand[]): Promise<void>;
}

export default IDiscordCommandRepository;