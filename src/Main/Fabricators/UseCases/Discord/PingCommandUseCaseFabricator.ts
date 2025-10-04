import PingCommandUseCase from "../../../../Application/UseCases/Discord/Commands/PingCommandUseCase.ts";
import { Client } from "discord.js";

class PingCommandUseCaseFabricator {

    static create(form: {discordClient: Client}) {
        const {discordClient} = form;
       return new PingCommandUseCase({discordClient});
    }
}

export default PingCommandUseCaseFabricator;