import app from "../app.js";
import DiscordMainControllerFabricator from "./Infrastructure/Fabricators/Controller/Discord/DiscordMainControllerFabricator.js";
import envConfig from "../env.config.js";
import { Client, IntentsBitField } from "discord.js";

interface RouteLayer {
    route?: {
        path: string;
        methods: { [method: string]: boolean };
    };
    name?: string;
    handle?: { stack?: RouteLayer[] };
}

// Manually create the Discord client instance
/**
 * @type {import('discord.js').Client}')}
 */
const discordClient = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ]
});

export default async function registerControllers() {

    // can use to integrate other applications with bot

    // const newsRouter = OtherController();
    // app.use("/other", otherRouter);


    const discordMainController = DiscordMainControllerFabricator.create({ discordClient });

    // Login the Discord client here, after all dependencies are resolved
    try {
        await discordClient.login(envConfig.discord.discordSecretToken);
        console.log("Discord client logged in successfully.");
    } catch (e) {
        console.error("Error logging in Discord client:", e);
    }

    discordMainController.registerEvents();

    const stack = app._router.stack;

    stack.forEach((middleware: RouteLayer) => {
        if (middleware.route && middleware.route.methods && middleware.route.path) {
            // Se for uma rota direta
            console.log(`${Object.keys(middleware.route.methods)[0].toUpperCase()} - ${middleware.route.path}`);
        } else if (middleware.name === "router") {
            // Se for um Router(), pegar as rotas internas
            const handlers: RouteLayer[] = middleware.handle?.stack ?? [];
            handlers.forEach((handler: RouteLayer) => {
                if (handler.route && handler.route.methods && handler.route.path) {
                    console.log(`${Object.keys(handler.route.methods)[0].toUpperCase()} - ${handler.route.path}`);
                }
            });
        }
    });

}