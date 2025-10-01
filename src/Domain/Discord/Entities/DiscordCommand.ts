import BaseEntity from "../../../Domain/Entities/BaseEntity.js";
import { SnowflakeId } from "../../Entities/ObjectValues/Id.js";

const DiscordCommandType = {
    SUB_COMMAND: 1,
    SUB_COMMAND_GROUP:	2
}


export class DiscordCommand extends BaseEntity<SnowflakeId> {
    name: string;
    description: string;
    type: number;
    handler: string;

    constructor(id: SnowflakeId, name: string, description: string, type: number, handler: string) {
        super(id);
        this.name = name;
        this.description = description;
        this.type = type;
        this.handler = handler; // Add handler property
    }

    getName(): string {
        return this.name.toLowerCase();
    }

    getDescription(): string {
        return this.description;
    }

    getType(): number {
        return this.type;
    }

    getHandler(): string {
        return this.handler;
    }
}

export class Commands {
    commands: DiscordCommand[];

    constructor({commands}: {commands: DiscordCommand[]}) {
        this.commands = commands;
    }

    getAllCommands(): DiscordCommand[] {
        return this.commands;
    }

    getAllCommandNames(): string[] {
        return this.commands.map(command => command.getName());
    }
};