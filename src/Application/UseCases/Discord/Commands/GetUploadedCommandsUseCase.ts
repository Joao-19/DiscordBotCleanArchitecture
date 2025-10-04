import IDiscordCommandRepository from "@/Application/Interfaces/Repositories/IDiscordCommandRepository.ts";
import { IGetUploadedCommandsUseCase } from "@/Domain/UseCases/Discord/Commands/IGetUploadedCommandsUseCase.ts";
import { Ok } from "ts-results/result.js";


export default class GetUploadedCommandsUseCase implements IGetUploadedCommandsUseCase {

    discordCommandRepository: IDiscordCommandRepository;

    constructor(discordCommandRepository: IDiscordCommandRepository) {
        this.discordCommandRepository = discordCommandRepository;
    }

    async execute() {
        return Ok(await this.discordCommandRepository.getUploadedCommands());
    }

}