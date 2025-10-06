import IChannelService from '@/Application/Services/Discord/IChannelService.ts';
import { ErrorTag } from '@/Domain/Error/BaseError.ts';
import UnknownError from '@/Domain/Error/UnknownError.ts';
import { Client, ChannelType, NewsChannel } from 'discord.js';
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

    async edit(guildId: string, channelId: string, newName: string): Promise<Result<void, UnknownError>> {
        try {
            let guild = this.discordClient.guilds.cache.get(guildId);
            if (!guild) {
                guild = await this.discordClient.guilds.fetch(guildId);
            }

            const channel = await guild.channels.fetch(channelId);
            if (!channel) {
                return Err(new UnknownError({
                    message: 'Channel not found',
                    tag: ErrorTag.DISCORD_CHANNEL
                }));
            }
            
            await channel.edit({ name: newName });
            return Ok(undefined);
        } catch (error) {
            console.error('Error editing channel:', error);
            return Err(new UnknownError({
                message: 'Failed to edit channel',
                tag: ErrorTag.DISCORD_CHANNEL
            }));
        }
    }

    async remove(guildId: string, channelId: string): Promise<Result<void, UnknownError>> {
        try {
            let guild = this.discordClient.guilds.cache.get(guildId);
            if (!guild) {
                guild = await this.discordClient.guilds.fetch(guildId);
            }

            const channel = await guild.channels.fetch(channelId);
            if (!channel) {
                return Err(new UnknownError({
                    message: 'Channel not found',
                    tag: ErrorTag.DISCORD_CHANNEL
                }));
            }

            await channel.delete();
            return Ok(undefined);
        } catch (error) {
            console.error('Error removing channel:', error);
            return Err(new UnknownError({
                message: 'Failed to remove channel',
                tag: ErrorTag.DISCORD_CHANNEL
            }));
        }
    }
}