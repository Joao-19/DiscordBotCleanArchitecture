import { Client } from "discord.js";
import { CommandOptionType, CommandType, DiscordCommand, DiscordCommandOption } from "../../Domain/Discord/Entities/DiscordCommand.ts";
import PingCommandUseCaseFabricator from "../Fabricators/UseCases/Discord/PingCommandUseCaseFabricator.ts";
import CreateChannelUseCaseFabricator from "../Fabricators/UseCases/Discord/Channels/CreateChannelUseCaseFabricator.ts";

export default function CreateCommands(discordClient: Client): DiscordCommand[] {
    const allCommands: DiscordCommand[] = [
        DiscordCommand.create({
            name: "ping",
            description: "Comando de teste, que sera respondido com pong.",
            type: 1,
            handler: PingCommandUseCaseFabricator.create({ discordClient })
        }),
        DiscordCommand.create({
            name: 'criar-chat',
            description: 'Cria um novo canal de texto no servidor.',
            type: CommandType.CHAT_INPUT,
            options: [
                DiscordCommandOption.create({
                    name: 'nome',
                    description: 'O nome que será dado ao novo canal.',
                    type: CommandOptionType.STRING,
                    required: true
                })
            ],
            subCommands: [],
            handler: CreateChannelUseCaseFabricator({ discordClient })
        })
    ];
    return allCommands;
}