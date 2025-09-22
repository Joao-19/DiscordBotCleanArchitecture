import { Client } from "discord.js"
import { IPingComandUseCaseErrors, IPingCommandUseCase, IPingCommandUseCaseResult, PingComandUseCaseForm } from "../../../../Domain/UseCases/Discord/Commands/IPingCommandUseCase.js";
import Results, { Result } from "ts-results";
import BaseError, { ErrorTag } from "../../../../Domain/Error/BaseError.js";


export default class PingCommandUseCase implements IPingCommandUseCase {


    discordClient: Client

    constructor(form: { discordClient: Client }) {
        const { discordClient } = form;
        this.discordClient = discordClient;
    }

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