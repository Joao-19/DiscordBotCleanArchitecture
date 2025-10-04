import IDiscordCommandRepository from "@/Application/Interfaces/Repositories/IDiscordCommandRepository.ts";
import { IGetDiscordCommandListUseCase } from "@/Domain/UseCases/Discord/Commands/IGetDiscordCommandListUseCase.ts";
import { Ok } from "ts-results/result.js";

class GetDiscordCommandListUseCase implements IGetDiscordCommandListUseCase {

    discordCommandRepository: IDiscordCommandRepository;

    constructor(discordCommandRepository: IDiscordCommandRepository) {
        this.discordCommandRepository = discordCommandRepository;
    }

    async execute() {
        const commands = await this.discordCommandRepository.getCommands();
        return Ok(commands);
    }
}

export default GetDiscordCommandListUseCase;