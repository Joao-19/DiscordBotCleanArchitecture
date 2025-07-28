import GetUploadedCommandsUseCase from './../../../../Application/UseCases/Discord/Commands/GetUploadedCommandsUseCase.js';

export default class GetUploadedCommandsUseCaseFabricator {
    static create(discordCommandRepository) {
        return new GetUploadedCommandsUseCase(discordCommandRepository);
    }
}