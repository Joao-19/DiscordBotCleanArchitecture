import { ApplicationCommandOptionType, Client, REST, Routes, ApplicationCommand } from "discord.js";
import { DiscordCommand, Commands, DiscordCommandSerialized, CommandOptionType } from "../../../Domain/Discord/Entities/DiscordCommand.ts";
import IDiscordCommandRepository from "../../../Application/Interfaces/Repositories/IDiscordCommandRepository.ts";
import { SnowflakeId } from "../../../Domain/Entities/ObjectValues/Id.ts";

const commandOptionTypeMap = {
    [CommandOptionType.STRING]: ApplicationCommandOptionType.String,
    [CommandOptionType.INTEGER]: ApplicationCommandOptionType.Integer,
    [CommandOptionType.BOOLEAN]: ApplicationCommandOptionType.Boolean,
    [CommandOptionType.USER]: ApplicationCommandOptionType.User,
    [CommandOptionType.CHANNEL]: ApplicationCommandOptionType.Channel,
    [CommandOptionType.ROLE]: ApplicationCommandOptionType.Role,
};

interface CommandOptionObject {
    name: string;
    description: string;
    type: ApplicationCommandOptionType;
    required?: boolean;
    options?: CommandOptionObject[];
}

interface CommandObject {
    name: string;
    description: string;
    type: number;
    options: CommandOptionObject[];
    subCommands: CommandObject[];
}

class DiscordCommandRepository implements IDiscordCommandRepository {

    discordValidateCommandsNameRegex = new RegExp("^[\\-_'\\p{L}\\p{N}\\p{sc=Deva}\\p{sc=Thai}]{1,32}$", "u");
    rest: REST;
    clientId: string;
    discordClient: Client;

    constructor(form: { clientId: string, rest: REST, discordClient: Client }) {
        const { clientId, rest, discordClient } = form;
        this.rest = rest;
        this.clientId = clientId
        this.discordClient = discordClient;
    }

    async getUploadedCommands() {
        const uploadedCommands: ApplicationCommand[] = await this.rest.get(Routes.applicationCommands(this.clientId)) as ApplicationCommand[];

        const botRegisteredCommands = await this.getCommands();
        const registeredCommandNames = botRegisteredCommands.getAllCommandNames();

        const registeredCommandNamesSet = new Set(registeredCommandNames);
        const validCommandsUploaded = uploadedCommands.filter(command => registeredCommandNamesSet.has(command.name));

        const serializedCommands = validCommandsUploaded.map(command => {
            return new DiscordCommandSerialized(command.id as unknown as SnowflakeId, command.name, command.description, command.type); // Use command.name as handler
        });
        return serializedCommands;
    }

    async updateCommands(commands: DiscordCommand[]): Promise<void> {
        try {
            // 1. Usa o Mapper para traduzir a lista de entidades para o formato JSON correto
            const formattedCommands = commands.map(command => this.mapCommandToJSON(command));

            // 2. Sua validação de nomes (continua útil)
            const commandNames = formattedCommands.map(cmd => cmd.name);
            const invalidCommandNames = commandNames.filter(name => !this.discordValidateCommandsNameRegex.test(name));
            if (invalidCommandNames.length > 0) {
                throw new Error(`Nomes de comando inválidos: ${invalidCommandNames.join(', ')}`);
            }

            console.log(`Registrando ${formattedCommands.length} comandos...`);
            console.log(commandNames.join('\n'));

            // 3. Envia os comandos formatados para a API do Discord
            // Usar 'application.commands.set()' é perfeitamente válido e mais direto
            await this.discordClient.application?.commands.set(formattedCommands);

            console.log("Comandos registrados com sucesso!");

        } catch (error) {
            console.error("Falha ao registrar os comandos de aplicativo:", error);
            // Você pode querer relançar o erro ou lidar com ele de forma mais específica
            throw error;
        }
    }

    async getCommands() {

        // MockComands, for testing, in the future can use a database or others.
        // const hardCodedCommands = [
        //     new DiscordCommand(SnowflakeId.fromString("3"), "Remover_Canal", "Remover um canal de texto.", 1, () => (execute() => {})),),
        //     new DiscordCommand(SnowflakeId.fromString("4"), "Atualizar_Canal", "Atualizar um canal de texto.", 1, "updateChannelHandler"),
        // ];
        const hardCodedCommands: DiscordCommand[] = [];
        const commands = new Commands({ commands: [] });
        return commands;
    }

    private mapCommandToJSON(command: DiscordCommand): CommandObject {
        const data: CommandObject = {
            name: command.getName(),
            description: command.getDescription(),
            type: command.getType(),
            options: [],
            subCommands: [],
        };

        // Mapeia opções (parâmetros) do comando principal ou de um subcomando
        if (command.options && command.options.length > 0) {
            data.options = command.options.map(opt => ({
                name: opt.name,
                description: opt.description,
                type: commandOptionTypeMap[opt.type],
                required: opt.required,
            }));
        }

        // Mapeia subcomandos e grupos de subcomandos (lógica recursiva)
        if (command.subCommands && command.subCommands.length > 0) {
            data.options = data.options || [];
            command.subCommands.forEach(subCmd => {
                // Se o subcomando TEM seus próprios subcomandos, ele é um GRUPO.
                if (subCmd.subCommands && subCmd.subCommands.length > 0) {
                    data.options.push({
                        name: subCmd.getName(),
                        description: subCmd.getDescription(),
                        type: ApplicationCommandOptionType.SubcommandGroup,
                        options: subCmd.subCommands.map(nestedSub => this.mapCommandToJSON(nestedSub))
                    });
                } else {
                    // Senão, é um subcomando simples.
                    data.options.push({
                        ...this.mapCommandToJSON(subCmd),
                        type: ApplicationCommandOptionType.Subcommand,
                    });
                }
            });
        }

        return data;
    }
}

export default DiscordCommandRepository;