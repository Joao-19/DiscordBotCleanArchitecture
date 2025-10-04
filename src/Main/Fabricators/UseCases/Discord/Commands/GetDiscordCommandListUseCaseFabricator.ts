import IDiscordCommandRepository from "../../../../../Application/Interfaces/Repositories/IDiscordCommandRepository.ts";
import GetDiscordCommandListUseCase from "../../../../../Application/UseCases/Discord/Commands/GetDiscordCommandListUseCase.ts";

class GetDiscordCommandListUseCaseFabricator {
    static create(discordCommandRepository: IDiscordCommandRepository) {
        return new GetDiscordCommandListUseCase(discordCommandRepository);
    }
}

export default GetDiscordCommandListUseCaseFabricator;