import PingCommandUseCase from "../../../../Application/UseCases/Discord/Commands/PingCommandUseCase.ts";
class PingCommandUseCaseFabricator {
    static create() {
        return new PingCommandUseCase();
    }
}

export default PingCommandUseCaseFabricator;