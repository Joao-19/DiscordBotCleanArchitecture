import UpdateDiscordCommandListUseCase from "../../../../../Application/UseCases/Discord/Commands/UpdateDiscordCommandListUseCase.ts";
import IDiscordCommandRepository from "../../../../../Application/Interfaces/Repositories/IDiscordCommandRepository.ts";

class UpdateDiscordCommandListUseCaseFabricator {
    static create(discordCommandRepository: IDiscordCommandRepository){
        return new UpdateDiscordCommandListUseCase(discordCommandRepository);
    }
}

export default UpdateDiscordCommandListUseCaseFabricator;