import { IGetUploadedCommandsUseCase } from "../../../../Domain/UseCases/Discord/Commands/IGetUploadedCommandsUseCase.js";
import IDiscordCommandRepository from "../../../../Application/Interfaces/Repositories/IDiscordCommandRepository.js";
import Results from "ts-results";

export default class GetUploadedCommandsUseCase implements IGetUploadedCommandsUseCase {

    discordCommandRepository: IDiscordCommandRepository;

    constructor(discordCommandRepository: IDiscordCommandRepository) {
        this.discordCommandRepository = discordCommandRepository;
    }

    async execute() {
        return Results.Ok(await this.discordCommandRepository.getUploadedCommands());
    }

}