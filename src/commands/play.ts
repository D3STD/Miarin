import { MessageEmbed } from 'discord.js';
import { QueryElement } from '../types/QueryElement';
import { ButtonsRowController } from '../controllers/playrow.controller.js';
import moment from 'moment';

moment.locale( 'ru' );

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

async function buildEmbed( song, interaction, player ): Promise<MessageEmbed> {
    await interaction.guild.members.fetch()
    console.log(song.requester)

    return new MessageEmbed()
    .setTitle( song.track.info.title )
    .setThumbnail( interaction.guild.iconURL({ dynamic: true }) )
    .setColor( '#5218fa' )
    .setAuthor({ name: song.track.info.author, url: song.track.info.uri })
    .addField( 'Заказал', '```\n' + await (await interaction.guild.members.cache.get( song.requester )).user.tag + '```' )
    .addFields(
        { name: 'Громкость', value: '```\n' + player.filters.volume + '```', inline: true },
        { name: 'Пауза', value: '```\n' + ( bot.shoukaku.getPlayerSettings( interaction.guild.id )?.pause === true ? 'Да' : 'Нет' ) + '```', inline: true },
        { name: 'Повтор', value: '```\n' + ( bot.shoukaku.getPlayerSettings( interaction.guild.id )?.repeat === true ? 'Да' : 'Нет' ) + '```', inline: true }
    );
}

export const execute = async( interaction ) => {
    if ( !interaction.member.voice.channelId ) return interaction.reply( { content: 'Вы не находитесь в голосовом чате!', ephemeral: true } );
    const node = bot.shoukaku.client.getNode();
    let data = await node.rest.resolve( interaction.options.get('song').value, 'youtube' );
    if ( !data ) { return interaction.reply( 'Нет ни одной песни по вашему запросу' ); }
    console.log(interaction.member.id);
    if ( bot.shoukaku.client.players.get( interaction.guild.id ) ) {
		data = data.tracks.shift();
        const song: QueryElement = {
            track: data,
            requester: interaction.member.id,
        }
		bot.shoukaku.addQuery( interaction.guild.id, song );
		return interaction.reply( { content: `Добавила песню \`${data.info.title}\` в плей лист`, ephemeral: true } );
	}

    const player = await node.joinChannel( {
		guildId: interaction.guild.id,
		channelId: interaction.member.voice.channelId,
		shardId: 0
	} );

    let rowController = new ButtonsRowController( interaction, player );

    const collector = interaction.channel.createMessageComponentCollector( {
		filter: (message) => { return message.user.id == bot.shoukaku.getQuery(interaction.guild.id)[0]?.requester }, time: 147483647
	} );

    collector.on( 'collect', async ( i ) => {
        await rowController.resolve( i );
        i.update({ embeds: [ await buildEmbed( song, interaction, player ) ], components: rowController.buildRow() });
    })

    bot.client.on( 'queryAdd', async ({ id, song }) => {
        if ( !id === interaction.guild.id ) return;
        
        if ( !player.track ) {
            player.playTrack( song.track );
            interaction.reply({ embeds: [ await buildEmbed( song, interaction, player ) ], components: rowController.buildRow() });
        } else interaction.editReply( { components: rowController.buildRow() } );
    })

    player.on('end', async () => {
        if ( bot.shoukaku.getPlayerSettings( interaction.guild.id )?.repeat === true ) {
            return player.playTrack( bot.shoukaku.getQuery(interaction.guild.id)[0]?.track );
        } else {
            if (bot.shoukaku.getQuery(interaction.guild.id)?.length >= 2) {
                bot.shoukaku.removeQuery( interaction.guild.id );
                player.playTrack( bot.shoukaku.getQuery(interaction.guild.id)[0]?.track );
                return await interaction.editReply({ embeds: [ await buildEmbed( bot.shoukaku.getQuery(interaction.guild.id)[0], interaction, player ) ], components: rowController.buildRow(), content: null });
            } else {
                bot.shoukaku.removeQuery( interaction.guild.id, true );
                await interaction.editReply('Плейлист пуст');
            }
        }
    })

    player.on( 'error', ( error ) => {
		console.error( error );
        interaction.channel.send(`Ошибка проигрывателя:\n\`\`\`js\n${error}\`\`\``);
		player.disconnect();
	} );

    for ( const event of [ 'closed', 'nodeDisconnect' ] ) {
		player.on( event, () => {
			try { player?.disconnect(); }
            catch ( e ) {
				null;
			}
		} );
	}

    data = data.tracks.shift();
    const song: QueryElement = {
        track: data,
        requester: interaction.member.id,
    }
    bot.shoukaku.addQuery( interaction.guild.id, song );
    // Сделать прослушивание песни
};

export const executeAC = async ( interaction ) => {
    try {
        if ( interaction.options.get('song').value.length < 3 ) return interaction.respond( null );
        const node = bot.shoukaku.client.getNode();
        const data: any = await node.rest.resolve( interaction.options.get('song').value, 'youtube' );
        if ( data.tracks.length < 1 ) return interaction.respond( null );
        const respond: Array<{ name: string, value: string }> = [];
        data.tracks.forEach( ( song ) => {
            song = song.info;
            if (song.title.length > 25) song.title = song.title.slice(0, 25) + '...';
            if (song.author.length > 15) song.title = song.title.slice(0, 15) + '...';
            return respond.push({
                name: `${song.title} от ${song.author}`,
                value: `${song.title} ${song.author}`
            })
        });
        interaction.respond(respond)
    }
    catch ( e ) { null }
}