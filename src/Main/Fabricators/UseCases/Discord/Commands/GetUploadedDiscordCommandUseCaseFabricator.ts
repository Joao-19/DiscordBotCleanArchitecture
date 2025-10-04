import IDiscordCommandRepository from "../../../../../Application/Interfaces/Repositories/IDiscordCommandRepository.ts";
import GetUploadedCommandsUseCase from "../../../../../Application/UseCases/Discord/Commands/GetUploadedCommandsUseCase.ts";

export default class GetUploadedCommandsUseCaseFabricator {
    static create(discordCommandRepositor: IDiscordCommandRepository) {
        return new GetUploadedCommandsUseCase(discordCommandRepositor);
    }
}