import {IUpdateDiscordCommandListUseCase, IUpdateDiscordCommandListUseCaseForm} from "../../../../Domain/UseCases/Discord/Commands/IUpdateDiscordCommandListUseCase.js";
import IDiscordCommandRepository from "../../../Interfaces/Repositories/IDiscordCommandRepository.js";
import Results from "ts-results";

class UpdateDiscordCommandListUseCase implements IUpdateDiscordCommandListUseCase {

    discordCommandRepository: IDiscordCommandRepository

/**
 * Initializes a new instance of the UpdateDiscordCommandListUseCase class.
 * @param discordCommandRepository - The repository for managing Discord commands.
 */

    constructor(discordCommandRepository: IDiscordCommandRepository) {
        this.discordCommandRepository = discordCommandRepository;
    }


    /**
     * Executes the use case.
     *
     * @param {IUpdateDiscordCommandListUseCaseForm} form - The form containing the commands to update.
     * @returns {Promise<Results.Result<Commands, BaseError>>}
     */
    
    async execute(form: IUpdateDiscordCommandListUseCaseForm) {
        const { commands } = form;
        return Results.Ok(await this.discordCommandRepository.updateCommands(commands));
    }
}

export default UpdateDiscordCommandListUseCase;