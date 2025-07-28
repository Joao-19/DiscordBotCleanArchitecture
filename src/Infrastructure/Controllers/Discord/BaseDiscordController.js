class BaseDiscordController {
    /**
     * @param {object} deps
     * @param {import('discord.js').Client} deps.discordClient
     */
    constructor({discordClient}) {
        if (!discordClient) {
            throw new Error("Discord client must be provided to BaseDiscordController");
        }
        this.client = discordClient;
    }

    registerEvents() {
        throw new Error("The 'registerEvents' method must be implemented by child controllers.");
    }
}

export default BaseDiscordController;