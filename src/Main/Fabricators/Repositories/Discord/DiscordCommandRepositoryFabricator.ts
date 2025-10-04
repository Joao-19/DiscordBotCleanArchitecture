import { Client, REST } from "discord.js";
import envConfig from "../../../../../env.config.js";
import DiscordCommandRepository from "../../../../Infrastructure/Repositories/Discord/DiscordCommandRepository.ts";

function DiscordCommandRepositoryFabricator(discordClient: Client) {

    const clientId = envConfig.discord.discordClientId;
    const secretToken = envConfig.discord.discordSecretToken;
    const rest = new REST({ version: '10' }).setToken(secretToken);
    return new DiscordCommandRepository({ clientId, rest, discordClient });

}

export default DiscordCommandRepositoryFabricator;