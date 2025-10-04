import { Client } from "discord.js";
import { CommandOptionType, CommandType, DiscordCommand, DiscordCommandOption } from "../../Domain/Discord/Entities/DiscordCommand.ts";
import PingCommandUseCaseFabricator from "../Fabricators/UseCases/Discord/PingCommandUseCaseFabricator.ts";
import CreateChannelUseCaseFabricator from "../Fabricators/UseCases/Discord/Channels/CreateChannelUseCaseFabricator.ts";

enum ChannelCommunicationType {
    TEXT = 0,
    VOICE = 2,
    CATEGORY = 4,
    // ... outros tipos conforme necessário
}

export default function CreateCommands(discordClient: Client): DiscordCommand[] {
    const allCommands: DiscordCommand[] = [
        DiscordCommand.create({
            name: "ping",
            description: "Comando de teste, que sera respondido com pong.",
            type: 1,
            handler: PingCommandUseCaseFabricator.create()
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
                }),
                DiscordCommandOption.create({
                    name: 'tipo',
                    description: 'O novo tipo do canal.',
                    type: CommandOptionType.INTEGER,
                    choices: [
                        { name: 'Texto', value: ChannelCommunicationType.TEXT },
                        { name: 'Voz', value: ChannelCommunicationType.VOICE },
                        { name: 'Categoria', value: ChannelCommunicationType.CATEGORY }
                    ],
                    required: true
                }),
                DiscordCommandOption.create({
                    name: 'categoria',
                    description: 'A categoria do novo canal, é opcional.',
                    type: CommandOptionType.CHANNEL,
                    required: false
                })
            ],
            subCommands: [],
            handler: CreateChannelUseCaseFabricator({ discordClient })
        })
    ];
    return allCommands;
}