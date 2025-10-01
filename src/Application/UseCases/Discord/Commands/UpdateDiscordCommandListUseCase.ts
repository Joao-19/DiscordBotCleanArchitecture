import {IUpdateDiscordCommandListUseCase, IUpdateDiscordCommandListUseCaseForm} from "../../../../Domain/UseCases/Discord/Commands/IUpdateDiscordCommandListUseCase.js";
import IDiscordCommandRepository from "../../../Interfaces/Repositories/IDiscordCommandRepository.js";
import Results from "ts-results";

class UpdateDiscordCommandListUseCase implements IUpdateDiscordCommandListUseCase {

    discordCommandRepository: IDiscordCommandRepository

    constructor(discordCommandRepository: IDiscordCommandRepository) {
        this.discordCommandRepository = discordCommandRepository;
    }

    async execute(form: IUpdateDiscordCommandListUseCaseForm) {
        const { commands } = form;
        return Results.Ok(await this.discordCommandRepository.updateCommands(commands));
    }
}

export default UpdateDiscordCommandListUseCase;