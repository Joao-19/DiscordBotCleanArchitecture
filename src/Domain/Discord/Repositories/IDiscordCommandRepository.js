import DiscordCommand from "../Entities/DiscordCommand.js";
import { Commands } from "../Entities/DiscordCommand.js";

/**
 * Interface for Discord command repository operations.
 */
class IDiscordCommandRepository {

    /**
     * Retrieves commands that have been uploaded to Discord.
     * @returns {Promise<Commands>} A promise that resolves to a Commands object.
     */
    async getUploadedCommands() {
        throw new Error("Method 'getUploadedCommands()' must be implemented.");
    }

    /**
     * Retrieves a list of available Discord commands.
     * @returns {Promise<Commands>} A promise that resolves to a Commands object.
     */
    async getCommands() {
        throw new Error("Method 'getCommands()' must be implemented.");
    }

    /**
     * Updates the Discord commands.
     * @param {DiscordCommand[]} commands - An array of DiscordCommand instances.
     * @returns {Promise<void>} A promise that resolves when the commands are updated.
     */
    async updateCommands(commands) {
        throw new Error("Method 'updateCommands()' must be implemented.");
    }
}

export default IDiscordCommandRepository;