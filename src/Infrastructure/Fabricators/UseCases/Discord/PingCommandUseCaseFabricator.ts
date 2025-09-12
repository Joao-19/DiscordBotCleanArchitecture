import PingCommandUseCase from "../../../../Application/UseCases/Discord/Commands/PingCommandUseCase.js";
import { Client } from "discord.js";

class PingCommandUseCaseFabricator {
    /**
     * Creates an instance of PingCommandUseCase.
     * @param {object} params
     * @param {import('discord.js').Client} params.discordClient - The Discord client instance.
     * @returns {import("../../../../Application/Interfaces/Services/IPingCommandUseCase.ts").default}
     */
    static create(form: {discordClient: Client}) {
        const {discordClient} = form;
       return new PingCommandUseCase({discordClient});
    }
}

export default PingCommandUseCaseFabricator;