export default class GetUploadedCommandsUseCase {

    constructor(discordCommandRepository) {
        this.discordCommandRepository = discordCommandRepository;
    }

    execute() {
        return this.discordCommandRepository.getUploadedCommands();
    }

}