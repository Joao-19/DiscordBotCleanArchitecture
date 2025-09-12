import BaseEntity from "../../../Domain/Entities/BaseEntity.js";
import { SnowflakeId } from "../../Entities/ObjectValues/Id.js";

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
 * @extends BaseEntity<SnowflakeId>
 */
export class DiscordCommand extends BaseEntity<SnowflakeId> {
    name: string;
    description: string;
    type: number;
    handler: string;
   /**
     * @param {string} id - The unique ID of the command. SnowflakeId.
     * @param {string} name - The name of the command.
     * @param {string} description - The description of the command.
     * @param {number} type - The type of the command (e.g., from DiscordCommandType).
     */
    constructor(id: SnowflakeId, name: string, description: string, type: number, handler: string) {
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
    getName(): string {
        return this.name.toLowerCase();
    }

    /**
     * Get the description of the command.
     * @returns {string} The command description.
     */
    getDescription(): string {
        return this.description;
    }

    /**
     * Get the type of the command.
     * @returns {number} The command type.
     */
    getType(): number {
        return this.type;
    }

    /**
     * Get the handler string for the command.
     * @returns {string} The command handler.
     */
    getHandler(): string {
        return this.handler;
    }

    // createMethod ?
}

/**
 * Manages a collection of Discord commands.
 */
export class Commands {
    /**
     * @type {DiscordCommand[]}
     */
    commands: DiscordCommand[];

    /**
     * @param {object} params
     * @param {DiscordCommand[]} params.commands - An array of DiscordCommand instances.
     */
    constructor({commands}: {commands: DiscordCommand[]}) {
        this.commands = commands;
    }

    /**
     * Get all registered commands.
     * @returns {DiscordCommand[]} An array of DiscordCommand instances.
     */
    getAllCommands(): DiscordCommand[] {
        return this.commands;
    }

    /**
     * Get the names of all registered commands.
     * @returns {string[]} An array of command names.
     */
    getAllCommandNames(): string[] {
        return this.commands.map(command => command.getName());
    }
};