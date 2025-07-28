import ErrorMessage from "./ErrorMessage.js";

export default class UnrecognizedMessageError extends ErrorMessage {

    defaultUnrecognizedCommandMessage = "Humm, não entendi o comando. Por favor, tente outro.";

    constructor(message) {
        super(message);
    }

    reply() {
        this.message.reply(defaultUnrecognizedCommandMessage);
    }
}