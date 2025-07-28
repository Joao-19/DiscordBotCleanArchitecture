import UpdateDiscordCommandListUseCase from "./../../../../Application/UseCases/Discord/Commands/UpdateDiscordCommandListUseCase.js";

class UpdateDiscordCommandListUseCaseFabricator {
    static create(discordCommandRepositoryInstance) {
        return new UpdateDiscordCommandListUseCase(discordCommandRepositoryInstance);
    }
}

export default UpdateDiscordCommandListUseCaseFabricator;