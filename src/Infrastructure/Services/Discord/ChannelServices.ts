import IChannelService from '@/Application/Services/Discord/IChannelService.ts';
import { ErrorTag } from '@/Domain/Error/BaseError.ts';
import UnknownError from '@/Domain/Error/UnknownError.ts';
import { Client, ChannelType } from 'discord.js';
import { Err, Ok, Result } from 'ts-results';

export class ChannelService implements IChannelService {
    private discordClient: Client;

    constructor(discordClient: Client) {
        this.discordClient = discordClient;
    }

    async create(guildId: string, channelName: string,type: number, category?: string): Promise<Result<void, UnknownError>> {
        try {
            let guild = this.discordClient.guilds.cache.get(guildId);
            if (!guild) {
                guild = await this.discordClient.guilds.fetch(guildId);
            }
            await guild.channels.create({
                name: channelName,
                type,
                parent: category || undefined
            });
            return Ok(undefined);
        } catch (error) {
            console.error('Error creating channel:', error);
            return Err(new UnknownError({
                message: 'Failed to create channel',
                tag: ErrorTag.DISCORD_CHANNEL
            }));
        }
    }
}