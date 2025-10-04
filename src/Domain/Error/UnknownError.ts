import { ChatInputCommandInteraction, Message } from "discord.js";
import BaseError, { ErrorTag } from "./BaseError.ts";

interface CommandNotFoundErrorForm {
    message?: string;
    data?: object;
    tag?: ErrorTag;
    interaction?: Message | ChatInputCommandInteraction;
}

export default class UnknownError extends BaseError {
    readonly interaction?: Message | ChatInputCommandInteraction;
    public message: string;

    constructor(form: CommandNotFoundErrorForm, cause?: Error) {
        const defaultMessage = "Erro desconhecido. Por favor, tente novamente mais tarde.";
        const finalForm = {
            ...form,
            message: form.message || defaultMessage,
            tag: form.tag || ErrorTag.DISCORD_COMMAND,
        };

        super(finalForm, cause);
        this.interaction = form.interaction;
        this.message = finalForm.message;
    }

    public async reply(): Promise<void> {
        if (!this.interaction) {
            return;
        }

        try {
            if (this.interaction instanceof Message) {
                await this.interaction.reply(this.message);
            } else if (this.interaction.isRepliable()) {
                await this.interaction.reply({ content: this.message, ephemeral: true });
            }
        } catch (error) {
            console.error("Failed to send reply for CommandNotFoundError:", error);
        }
    }
}

