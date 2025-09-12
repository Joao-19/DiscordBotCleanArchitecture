import { IGetUploadedCommandsUseCase } from "../../../../Domain/UseCases/Discord/Commands/IGetUploadedCommandsUseCase.js";
import IDiscordCommandRepository from "../../../../Application/Interfaces/Repositories/IDiscordCommandRepository.js";
import Results from "ts-results";

/**
 *  @type {import("../../../../Application/Interfaces/Services/IGetUploadedCommandsUseCase.ts").default}
 */
export default class GetUploadedCommandsUseCase implements IGetUploadedCommandsUseCase {

    /** 
     * @param {import("../../../../Application/Interfaces/Repositories/IDiscordCommandRepository.ts").default} discordCommandRepository
     *  */

    discordCommandRepository: IDiscordCommandRepository;

    constructor(discordCommandRepository: IDiscordCommandRepository) {
        this.discordCommandRepository = discordCommandRepository;
    }

    async execute() {
        return Results.Ok(await this.discordCommandRepository.getUploadedCommands());
    }

}