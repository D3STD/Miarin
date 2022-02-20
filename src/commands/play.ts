import { MessageEmbed } from 'discord.js';
import fetch from 'node-fetch';

import { SongRespond } from '../types/MeguApiSongRespond';

export const info = {
    name: 'play',
    description: 'Включить / добавить в плейлист песню',
    options: [{
        name: 'song',
        description: 'Введите название песни',
        required: true,
        autocomplete: true,
        type: 3
    }]
};

export const execute = async( interaction ) => {
    if ( !interaction.member.voice.channelId ) return interaction.reply( { content: 'Вы не находитесь в голосовом чате!', ephemeral: true } );

    const node = bot.shoukaku.client.getNode();
    let data = await node.rest.resolve( interaction.options.get('song').value, 'youtube' );
    if ( !data ) { return interaction.reply( 'Нет ни одной песни по вашему запросу' ); }
    // Сделать прослушивание песни
};

export const executeAC = async ( interaction ) => {
    const data: any = await (await fetch(`https://megumin.one/api/songs?query=${interaction.options.get('song').value}`)).json();
    if ( !data.length ) return interaction.respond( null );
    const respond: Array<{ name: string, value: string }> = [];
    data.forEach( ( song: SongRespond ) => {
        if (!(song.type === 'song')) return;
        return respond.push({
            name: `${song.title} от ${song.artist_names}`,
            value: `${song.title} ${song.artist_names}`
        })
    });
    interaction.respond(respond)
}