import { REST } from "discord.js";
import envConfig from "../../../../../env.config.js";
import DiscordCommandRepository from "../../../Repositories/Discord/DiscordCommandRepository.js"

class DiscordCommandRepositoryFabricator {
    static create() {
        const clientId = envConfig.discord.discordClientId;
        const secretToken = envConfig.discord.discordSecretToken;
        const rest = new REST({ version: '10' }).setToken(secretToken);
        return new DiscordCommandRepository({clientId, rest});
    }
}

export default DiscordCommandRepositoryFabricator;