import { IPingCommandUseCase, PingComandUseCaseForm, IPingComandUseCaseErrors, IPingCommandUseCaseResult } from "@/Domain/UseCases/Discord/Commands/IPingCommandUseCase.ts";
import { Result, Ok } from "ts-results/result.js";

export default class PingCommandUseCase implements IPingCommandUseCase {

    constructor() { }

    async execute(form: PingComandUseCaseForm): Promise<Result<IPingCommandUseCaseResult, IPingComandUseCaseErrors>> {
        const replySuccess = "Pong! La ele...";
        return Ok({ replyMessage: replySuccess });
    }
}