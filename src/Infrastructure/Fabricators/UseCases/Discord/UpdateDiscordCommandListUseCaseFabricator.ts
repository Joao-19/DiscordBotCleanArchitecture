// import IUpdateDiscordCommandListUseCase from "../../../../Application/Interfaces/Services/IUpdateDiscordCommandListUseCase.ts";

class UpdateDiscordCommandListUseCaseFabricator {
    static create(/** @type {import("../../../../Application/Interfaces/Repositories/IDiscordCommandRepository.ts").default} */ discordCommandRepositoryInstance) {
        return new /** @class */ (function () {
           function UpdateDiscordCommandListUseCase(discordCommandRepositoryInstance) {
               this.discordCommandRepository = discordCommandRepositoryInstance;
           }
           UpdateDiscordCommandListUseCase.prototype.execute = function (commands: DiscordCommand[]) {
               return this.discordCommandRepository.updateCommands(commands);
           };
           return UpdateDiscordCommandListUseCase;
       }());
   }
}

export default UpdateDiscordCommandListUseCaseFabricator;