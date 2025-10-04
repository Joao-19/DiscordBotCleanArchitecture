import IDiscordCommandRepository from "@/Application/Interfaces/Repositories/IDiscordCommandRepository.ts";
import { IUpdateDiscordCommandListUseCase, IUpdateDiscordCommandListUseCaseForm } from "@/Domain/UseCases/Discord/Commands/IUpdateDiscordCommandListUseCase.ts";
import { Ok } from "ts-results/result.js";


class UpdateDiscordCommandListUseCase implements IUpdateDiscordCommandListUseCase {

    discordCommandRepository: IDiscordCommandRepository

    constructor(discordCommandRepository: IDiscordCommandRepository) {
        this.discordCommandRepository = discordCommandRepository;
    }

    async execute(form: IUpdateDiscordCommandListUseCaseForm) {
        const { commands } = form;
        return Ok(await this.discordCommandRepository.updateCommands(commands));
    }
}

export default UpdateDiscordCommandListUseCase;