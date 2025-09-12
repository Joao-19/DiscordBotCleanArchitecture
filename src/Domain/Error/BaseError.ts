export enum ErrorTag {
    API = "API",
    DISCORD_API = "DISCORD_API",
    DISCORD = "DISCORD",
    DISCORD_COMMAND = "DISCORD_COMMAND",
    DATABASE = "DATABASE",
    VALIDATION = "VALIDATION",
    UNNEXPECTED = "UNNEXPECTED",
    GENERIC = "GENERIC",
}

export default class BaseError extends Error {

    /*
     * @param {string} message - The error message.
     * @param {Object} data - Additional data associated with the error.
     */
    readonly tag: ErrorTag;
    readonly data?: object;

   /*
     * @param {string} message - The error message.
     * @param {Object} data - Additional data associated with the error.
     */
    constructor(form: {
        message?: string,
        data?: object,
        tag?: string
    }, public readonly cause?: Error) {
        const {
            message = "Something went wrong, please try again.",
            data,
            tag = ErrorTag.UNNEXPECTED,
        } = form;
        super(message);
        this.data = data;
        this.tag = tag as ErrorTag;
    }
}