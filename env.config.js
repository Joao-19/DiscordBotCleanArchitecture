import "dotenv/config"; // Importa automaticamente as variáveis do .env

const config = {
    host: {
        domain: process.env.HOST || "localhost",
        port: process.env.PORT || 8080,
    },
    discord: {
        discordSecretToken: process.env['DISCORD_SECRET_API_KEY'] || "discordSecretToken",
        discordClientId: process.env['DISCORD_CLIENT_ID'] || "discordClientId",
        commands: {
            shortcutIdentifier: process.env.DISCORD_COMMANDS_SHORTCUT_IDENTIFIER || "!",
        }
    }
};

export default config;