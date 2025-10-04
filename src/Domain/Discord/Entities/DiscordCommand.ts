import UseCase from "../../../Domain/UseCases/Discord/DiscordUseCase.ts";
import BaseEntity from "../../../Domain/Entities/BaseEntity.ts";
import { SnowflakeId } from "../../Entities/ObjectValues/Id.ts";

export enum CommandType {
    CHAT_INPUT = 1,
    // ... outros tipos de comando base se necessário
}

export enum CommandOptionType {
    STRING,
    INTEGER,
    BOOLEAN,
    USER,
    CHANNEL,
    ROLE,
    // ... outros tipos
}

export class DiscordCommandOption {
    name: string;
    description: string;
    type: CommandOptionType;
    required: boolean;

    constructor(name: string, description: string, type: CommandOptionType, required: boolean) {
        this.name = name;
        this.description = description;
        this.type = type;
        this.required = required;
    }

    static create(form: { name: string, description: string, type: CommandOptionType, required: boolean }): DiscordCommandOption {
        const { name, description, type, required } = form;
        return new DiscordCommandOption(name, description, type, required);
    }
}

export type CommandHandler = UseCase<any, any>;

export interface CreateCommandForm {
    name: string;
    description: string;
    type: number;
    handler?: CommandHandler;
    options?: DiscordCommandOption[];
    subCommands?: DiscordCommand[];
}

export class DiscordCommand extends BaseEntity<SnowflakeId> {
    name: string;
    description: string;
    type: number;
    handler: CommandHandler | undefined;

    options: DiscordCommandOption[];
    subCommands: DiscordCommand[];

    // Construtor atualizado
    constructor(
        id: SnowflakeId,
        name: string,
        description: string,
        type: CommandType,
        options: DiscordCommandOption[] = [], // Padrão para array vazio
        subCommands: DiscordCommand[] = [], // Padrão para array vazio
        handler: CommandHandler | undefined = undefined
    ) {
        super(id);
        this.name = name;
        this.description = description;
        this.type = type;
        this.options = options;
        this.subCommands = subCommands;
        this.handler = handler;
    }

    static create(form: CreateCommandForm): DiscordCommand {
        const { name, description, type, handler, options, subCommands } = form;
        return new DiscordCommand(
            new SnowflakeId("UNKNOWN"),
            name,
            description,
            type,
            options,
            subCommands,
            handler
        );
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

}

export class Commands {
    commands: DiscordCommand[];

    constructor({ commands }: { commands: DiscordCommand[] }) {
        this.commands = commands;
    }

    getAllCommands(): DiscordCommand[] {
        return this.commands;
    }

    getAllCommandNames(): string[] {
        return this.commands.map(command => command.getName());
    }
};

export class DiscordCommandSerialized extends BaseEntity<SnowflakeId> {
    name: string;
    description: string;
    type: number;

    constructor(id: SnowflakeId, name: string, description: string, type: number) {
        super(id);
        this.name = name;
        this.description = description;
        this.type = type;
    }

    static create(form: { name: string, description: string, type: number }): DiscordCommandSerialized {
        const { name, description, type } = form;
        return new DiscordCommandSerialized(new SnowflakeId("UNKNOWN"), name, description, type);
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
}