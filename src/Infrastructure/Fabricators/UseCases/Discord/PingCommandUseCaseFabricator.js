import PingCommandUseCase from "../../../../Application/UseCases/Discord/Commands/PingCommandUseCase.js";

class PingCommandUseCaseFabricator {
    /**
     * Creates an instance of PingCommandUseCase.
     * @param {object} params
     * @param {import('discord.js').Client} params.discordClient - The Discord client instance.
     * @returns {PingCommandUseCase}
     */
    static create({discordClient}) {
        return new PingCommandUseCase({discordClient});
    }
}

export default PingCommandUseCaseFabricator;