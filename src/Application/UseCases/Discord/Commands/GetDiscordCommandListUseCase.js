class GetDiscordCommandListUseCase {
    constructor(discordCommandRepository) {
        this.discordCommandRepository = discordCommandRepository;
    }

    async execute() {
        const commands = await this.discordCommandRepository.getCommands();
        return commands;
    }
}

export default GetDiscordCommandListUseCase;