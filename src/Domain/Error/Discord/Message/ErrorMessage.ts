import { Message, ChatInputCommandInteraction } from "discord.js";
import BaseError, { ErrorTag } from "../../BaseError.js";

export default class ErrorMessage extends BaseError {

    messageInteraction: Message | ChatInputCommandInteraction;

    constructor(form:{
        messageInteraction: Message | ChatInputCommandInteraction,
        message?: string,
        data?: Object,
        tag?: ErrorTag
    }, public readonly cause?: Error) {
        const { messageInteraction, tag = ErrorTag.DISCORD } = form;
        super({ ...form, tag});
        this.messageInteraction = messageInteraction;
    }
}