import UnrecognizedMessageError from "../../../../Domain/Error/Message/UnrecognizedMessageError.js";

export default class PingCommandUseCase {

    /**
     * @param {object} params
     * @param {import('discord.js').Client} params.discordClient
     */
    constructor({discordClient}) {
        this.discordClient = discordClient;
    }

    /**
     * Executes the Ping command.
     * @param {object} form - The form data for the command.
     * @param {import('discord.js').Message | undefined} [form.message] - The message object if it's a message command.
     * @param {import('discord.js').ChatInputCommandInteraction | undefined} [form.interaction] - The interaction object if it's a slash command.
     * @returns {Promise<void>}
     */
    async execute(form) {
        const { message, interaction } = form;
        
        if (message) {
            if (message.content != "!ping") {
                // Assuming UnrecognizedMessageError has a static reply method or similar
                // This part might need adjustment based on its actual implementation
                throw new UnrecognizedMessageError("Unrecognized message for ping command.");
            }
            await message.reply("Pong! La ele...");
            return;
        }

        if (interaction) {
            await interaction.reply("Pong! La ele...");
            return;
        }

        // Fallback if neither message nor interaction is provided
        console.warn("PingCommandUseCase executed without message or interaction.");
    }
}