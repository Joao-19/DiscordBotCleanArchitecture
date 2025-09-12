import IDiscordCommandRepository from "../../../../Application/Interfaces/Repositories/IDiscordCommandRepository.js";
import GetDiscordCommandListUseCase from "../../../../Application/UseCases/Discord/Commands/GetDiscordCommandListUseCase.js";

class GetDiscordCommandListUseCaseFabricator {
    static create(discordCommandRepository: IDiscordCommandRepository) {
        return new GetDiscordCommandListUseCase(discordCommandRepository);
    }
}

export default GetDiscordCommandListUseCaseFabricator;