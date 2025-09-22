import { REST, Routes } from "discord.js";
import {DiscordCommand, Commands } from "../../../Domain/Discord/Entities/DiscordCommand.js";
import IDiscordCommandRepository from "../../../Application/Interfaces/Repositories/IDiscordCommandRepository.js";
import { ApplicationCommand } from 'discord.js'
import { SnowflakeId } from "../../../Domain/Entities/ObjectValues/Id.js";


class DiscordCommandRepository implements IDiscordCommandRepository {

    discordValidateCommandsNameRegex = new RegExp("^[\\-_'\\p{L}\\p{N}\\p{sc=Deva}\\p{sc=Thai}]{1,32}$", "u");
    rest: REST;
    clientId: string;

    constructor(form:{ clientId:string, rest: REST}) {
        const { clientId, rest } = form;
        this.rest = rest;
        this.clientId = clientId
    }

    async getUploadedCommands() {
        const uploadedCommands: ApplicationCommand[] = await this.rest.get(Routes.applicationCommands(this.clientId)) as ApplicationCommand[];      
        console.log("Uploaded commands:", uploadedCommands.length);

        const botRegisteredCommands = await this.getCommands();
        const registeredCommandNames = botRegisteredCommands.getAllCommandNames();

        const registeredCommandNamesSet = new Set(registeredCommandNames);
        const validCommandsUploaded = uploadedCommands.filter(command => registeredCommandNamesSet.has(command.name));

        const serializedCommands = validCommandsUploaded.map(command => {
            return new DiscordCommand(command.id as unknown as SnowflakeId, command.name, command.description, command.type, command.name); // Use command.name as handler
        });
        return new Commands({commands: serializedCommands});
    }

    async updateCommands(commands: DiscordCommand[]) {
        const formattedCommands = commands.map(command => ({
            name: command.getName().toLowerCase(),
            description: command.getDescription(),
            type: command.getType(), // Include type for Discord API
        }));

        const testCommandNames = formattedCommands.map(command => command.name);
        const invalidCommandNames = testCommandNames.filter(commandName => !this.discordValidateCommandsNameRegex.test(commandName));
        if (invalidCommandNames.length > 0) {
            throw new Error(`Invalid command names: ${invalidCommandNames.join(', ')}`);
        }
        console.log("Updated commands:\n", testCommandNames.join('\n'));
        await this.rest.put(Routes.applicationCommands(this.clientId), { body: formattedCommands });
    }

    async getCommands() {
        
        // MockComands, for testing, in the future can use a database or others.
        const hardCodedCommands = [
            new DiscordCommand(SnowflakeId.fromString("1"), "Ping", "Comando de teste, que sera respondido com pong.", 1, "pingHandler"),
            new DiscordCommand(SnowflakeId.fromString("2"), "Criar_Canal", "Criar um canal de texto.", 1, "createChatHandler"),
            new DiscordCommand(SnowflakeId.fromString("3"), "Remover_Canal", "Remover um canal de texto.", 1, "removeChannelHandler"),
            new DiscordCommand(SnowflakeId.fromString("4"), "Atualizar_Canal", "Atualizar um canal de texto.", 1, "updateChannelHandler"),
        ];
        
        const commands = new Commands({commands: hardCodedCommands});
        return commands;
    }
}

export default DiscordCommandRepository;