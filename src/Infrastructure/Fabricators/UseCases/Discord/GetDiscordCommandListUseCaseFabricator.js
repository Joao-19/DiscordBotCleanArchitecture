import GetDiscordCommandListUseCase from "../../../../Application/UseCases/Discord/Commands/GetDiscordCommandListUseCase.js";

class GetDiscordCommandListUseCaseFabricator {
    static create(discordCommandRepository) {
        return new GetDiscordCommandListUseCase(discordCommandRepository);
    }
}

export default GetDiscordCommandListUseCaseFabricator;