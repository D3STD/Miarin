import { CommandInteraction, Interaction } from 'discord.js';

export type Command = {
    info: {
        name: string;
        description: string;
        parentOf?: string;
    }
    parentOf?: string;
    executeAC?: ( interaction: Interaction ) => Promise<void>;
    execute: (interaction: CommandInteraction) => Promise<void>;
}