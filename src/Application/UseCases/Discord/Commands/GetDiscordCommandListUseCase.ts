import Results from "ts-results";
import { IGetDiscordCommandListUseCase } from "../../../../Domain/UseCases/Discord/Commands/IGetDiscordCommandListUseCase.js";
import IDiscordCommandRepository from "../../../../Application/Interfaces/Repositories/IDiscordCommandRepository.js";

class GetDiscordCommandListUseCase implements IGetDiscordCommandListUseCase {

    discordCommandRepository: IDiscordCommandRepository;

    constructor(discordCommandRepository: IDiscordCommandRepository) {
        this.discordCommandRepository = discordCommandRepository;
    }

    async execute() {
        const commands = await this.discordCommandRepository.getCommands();
        return Results.Ok(commands);
    }
}

export default GetDiscordCommandListUseCase;