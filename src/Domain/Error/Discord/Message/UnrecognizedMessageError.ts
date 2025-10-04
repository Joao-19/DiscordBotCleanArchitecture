import ErrorMessage from "./ErrorMessage.ts";

export default class UnrecognizedMessageError extends ErrorMessage {

    defaultUnrecognizedCommandMessage = "Humm, não entendi o comando. Por favor, tente outro.";

    reply() {
        this.messageInteraction.reply(this.defaultUnrecognizedCommandMessage);
    }
}