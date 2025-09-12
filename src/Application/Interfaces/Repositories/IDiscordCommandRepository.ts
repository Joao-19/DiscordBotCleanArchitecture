import { DiscordCommand } from "../../../Domain/Discord/Entities/DiscordCommand.js";
import { Commands } from "../../../Domain/Discord/Entities/DiscordCommand.js";

/**
 * Interface for Discord command repository operations.
 */
interface IDiscordCommandRepository {
    /**
     * Retrieves commands that have been uploaded to Discord.
     * @returns {Promise<Commands>} A promise that resolves to a Commands object.
     */
    getUploadedCommands(): Promise<Commands>;

    /**
     * Retrieves a list of available Discord commands.
     * @returns {Promise<Commands>} A promise that resolves to a Commands object.
     */
    getCommands(): Promise<Commands>;

    /**
     * Updates the Discord commands.
     * @param {DiscordCommand[]} commands - An array of DiscordCommand instances.
     * @returns {Promise<void>} A promise that resolves when the commands are updated.
     */
    updateCommands(commands: DiscordCommand[]): Promise<void>;
}

export default IDiscordCommandRepository;