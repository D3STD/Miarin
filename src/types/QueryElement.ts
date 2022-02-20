import { ShoukakuTrack } from 'shoukaku';
import { GuildMember } from 'discord.js';

export type QueryElement = {
    requester: GuildMember,
    track: ShoukakuTrack
}