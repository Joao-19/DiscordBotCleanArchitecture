import { Client } from "discord.js";
import { Result, Err } from "ts-results"
import BaseError from "../../../Domain/Error/BaseError.ts";

type BaseDiscordController<Response = unknown , Errors extends Error = BaseError | Error> = {
    discordClient: Client;
    registerEvents(): Result<Response, Errors>;
}

export default BaseDiscordController;