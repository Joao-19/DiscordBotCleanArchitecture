import BaseError, { ErrorTag } from "@/Domain/Error/BaseError.ts";
import { IPingCommandUseCase, PingComandUseCaseForm, IPingComandUseCaseErrors } from "@/Domain/UseCases/Discord/Commands/IPingCommandUseCase.ts";
import { Client } from "discord.js";
import { Result, Ok, Err } from "ts-results/result.js";

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
                return Ok(undefined);
            }
    
            if (interaction) {
                // interaction.reply() will throw on failure. We catch it below.
                await interaction.reply(replyContent);
                return Ok(undefined);
            }
        } catch (error) {
            console.error("Failed to reply to ping command:", error);
            const errorMessage = error instanceof Error ? error.message : String(error);
            return Err(new BaseError({
                message: `Failed to send reply for ping command: ${errorMessage}`,
                tag: ErrorTag.DISCORD_COMMAND
            }));
        }

        // Fallback if neither message nor interaction is provided
        console.warn("PingCommandUseCase executed without message or interaction.");
        return Err(new BaseError({ message: "No message or interaction provided.", tag: ErrorTag.DISCORD_COMMAND }));
    }
}