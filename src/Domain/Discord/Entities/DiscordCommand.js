import BaseEntity from "../../Entities/BaseEntity.js";

/**
 * @typedef {object} DiscordCommandType
 * @property {number} SUB_COMMAND - Represents a sub-command.
 * @property {number} SUB_COMMAND_GROUP - Represents a sub-command group.
 */
const DiscordCommandType = {
    SUB_COMMAND: 1,
    SUB_COMMAND_GROUP:	2
}

/**
 * Represents a Discord command entity.
 * @extends BaseEntity
 */
class DiscordCommand extends BaseEntity {
    /**
     * @param {string} id - The unique ID of the command.
     * @param {string} name - The name of the command.
     * @param {string} description - The description of the command.
     * @param {number} type - The type of the command (e.g., from DiscordCommandType).
     */
    constructor(id, name, description, type, handler) {
        super(id);
        this.name = name;
        this.description = description;
        this.type = type;
        this.handler = handler; // Add handler property
    }

    /**
     * Get the name of the command.
     * @returns {string} The command name in lowercase.
     */
    getName() {
        return this.name.toLowerCase();
    }

    /**
     * Get the description of the command.
     * @returns {string} The command description.
     */
    getDescription() {
        return this.description;
    }

    /**
     * Get the type of the command.
     * @returns {number} The command type.
     */
    getType() {
        return this.type;
    }

    /**
     * Get the handler string for the command.
     * @returns {string} The command handler.
     */
    getHandler() {
        return this.handler;
    }
}

/**
 * Manages a collection of Discord commands.
 */
export class Commands {
    /**
     * @type {DiscordCommand[]}
     */
    static commands = [];

    /**
     * @param {object} params
     * @param {DiscordCommand[]} params.commands - An array of DiscordCommand instances.
     */
    constructor({commands}) {
        this.commands = commands;
    }

    /**
     * Get all registered commands.
     * @returns {DiscordCommand[]} An array of DiscordCommand instances.
     */
    getAllCommands() {
        return this.commands;
    }

    /**
     * Get the names of all registered commands.
     * @returns {string[]} An array of command names.
     */
    getAllCommandNames() {
        return this.commands.map(command => command.getName());
    }
};

export default DiscordCommand;