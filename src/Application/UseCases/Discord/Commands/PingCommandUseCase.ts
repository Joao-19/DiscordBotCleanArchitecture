import { Client } from "discord.js"
import { IPingComandUseCaseErrors, IPingCommandUseCase, IPingCommandUseCaseResult, PingComandUseCaseForm } from "../../../../Domain/UseCases/Discord/Commands/IPingCommandUseCase.js";
import Results, { Result } from "ts-results";
import BaseError, { ErrorTag } from "../../../../Domain/Error/BaseError.js";

/**
 * @type {import("../../../Interfaces/Services/IPingCommandUseCase.ts").default}
 */
export default class PingCommandUseCase implements IPingCommandUseCase {


    discordClient: Client

    /**
     * @param {object} params
     * @param {import('discord.js').Client} params.discordClient
     */
    constructor(form: { discordClient: Client }) {
        const { discordClient } = form;
        this.discordClient = discordClient;
    }

    /**
     * Executes the Ping command.
     * @param {object} form - The form data for the command.
     * @param {import('discord.js').Message | undefined} [form.message] - The message object if it's a message command.
     * @param {import('discord.js').ChatInputCommandInteraction | undefined} [form.interaction] - The interaction object if it's a slash command.
     * @returns {Promise<void>}
     */
    async execute(form: PingComandUseCaseForm): Promise<Result<void, IPingComandUseCaseErrors>> {
        const { message, interaction } = form;
        const replyContent = "Pong! La ele...";

        try {
            if (message) {
                // The CommandBridgeService already routed to this use case,
                // so we don't need to check message.content again.
                await message.reply(replyContent);
                return Results.Ok(undefined);
            }
    
            if (interaction) {
                // interaction.reply() will throw on failure. We catch it below.
                await interaction.reply(replyContent);
                return Results.Ok(undefined);
            }
        } catch (error) {
            console.error("Failed to reply to ping command:", error);
            const errorMessage = error instanceof Error ? error.message : String(error);
            return Results.Err(new BaseError({
                message: `Failed to send reply for ping command: ${errorMessage}`,
                tag: ErrorTag.DISCORD_COMMAND
            }));
        }

        // Fallback if neither message nor interaction is provided
        console.warn("PingCommandUseCase executed without message or interaction.");
        return Results.Err(new BaseError({ message: "No message or interaction provided.", tag: ErrorTag.DISCORD_COMMAND }));
    }
}