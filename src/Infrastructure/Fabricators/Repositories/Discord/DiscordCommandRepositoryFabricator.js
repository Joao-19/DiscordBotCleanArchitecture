import envConfig from "../../../../../env.config.js";
import DiscordCommandRepository from "../../../Repositories/Discord/DiscordCommandRepository.js"

class DiscordCommandRepositoryFabricator {
    static create() {
        const clientId = envConfig.discord.discordClientId;
        const secretToken = envConfig.discord.discordSecretToken;
        return new DiscordCommandRepository({clientId, secretToken});
    }
}

export default DiscordCommandRepositoryFabricator;