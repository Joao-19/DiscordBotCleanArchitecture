class UpdateDiscordCommandListUseCase {
    constructor(discordCommandRepository) {
        this.discordCommandRepository = discordCommandRepository;
    }

    async execute(commands) {
        return await this.discordCommandRepository.updateCommands(commands);
    }
}

export default UpdateDiscordCommandListUseCase;