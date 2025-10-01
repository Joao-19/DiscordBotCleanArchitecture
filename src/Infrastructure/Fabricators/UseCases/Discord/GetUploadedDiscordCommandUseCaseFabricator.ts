import IDiscordCommandRepository from "../../../../Application/Interfaces/Repositories/IDiscordCommandRepository.js";
import GetUploadedCommandsUseCase from "../../../../Application/UseCases/Discord/Commands/GetUploadedCommandsUseCase.js";

export default class GetUploadedCommandsUseCaseFabricator {
    static create(discordCommandRepositor: IDiscordCommandRepository) {
        return new GetUploadedCommandsUseCase(discordCommandRepositor);
    }
}