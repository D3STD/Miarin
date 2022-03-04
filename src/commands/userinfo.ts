import { MessageEmbed, GuildMember } from 'discord.js';

export const info = {
    name: 'userinfo',
    description: 'Получить информацию о сервере',
    options: [{
        type: 6,
        name: 'user',
        description: 'Укажите пользователя',
        required: false,
    }]
};

const statuses = {
	online: 'Онлайн',
	idle: 'Спит',
	dnd: 'Не беспокоить',
	offline: 'Не в сети'
};

export const execute = async( interaction ) => {
    const member: GuildMember = interaction.options.get( 'user' )?.member ?? interaction.member;
    const user = await bot.client.users.fetch( member.id, { force: true } );
    const activities = member.presence?.activities?.length > 0 ? member.presence.activities : null;
	const status: string = activities ? activities[ 0 ].type === 'CUSTOM' ? `${activities[ 0 ]?.emoji ? '<:' + activities[ 0 ]?.emoji.name + ':' + activities[ 0 ]?.emoji.id + '>' : ''} ${activities[ 0 ]?.state ? activities[ 0 ].state : ''}` : '' : 'Нету';
    const embed: MessageEmbed = new MessageEmbed()
		.setTitle( member.user.tag )
		.setDescription( `${statuses[ member.presence?.status || 'offline' ]}\n${status}\n**Роли:**\n${member.roles.cache.filter( ( role ) => role.id !== interaction.guild.id ).map( ( r ) => `${r}` ).join( ' ' )}` )
		.addField( 'Дата регистрации', `\`\`\`${member.user.createdAt.toLocaleString( 'ru' )}\`\`\``, true )
		.addField( 'Зашел на сервер', `\`\`\`${member.joinedAt.toLocaleString( 'ru' )}\`\`\``, true )
		.setColor(member.roles?.color?.color ?? '#767cfe')
		.setThumbnail( user.bannerURL({ size: 2048, dynamic: true }) !== null ? member.user.avatarURL( { format: 'png', size: 2048, dynamic: true } ) : '' )
		.setImage(user.bannerURL({ size: 2048, dynamic: true }) ?? member.user.avatarURL( { format: 'png', size: 2048, dynamic: true } ));

	if ( activities ) {
		for ( const activity of activities ) {
			if ( activity.type === 'PLAYING' ) {
				embed.addField( 'Играет в', `\`\`\`Игра :: ${String( activity.name )}${activity.details !== null ? '\n' + activity.details : ''} ${activity.assets?.largeText ? '::' : ''} ${activity.assets?.largeText || ''}\n${activity.state || ''}\`\`\``, false );
			} else if ( activity.type === 'STREAMING' ) {
				embed.addField( 'Стримит ', `\`\`\`Название :: ${activity.name}${activity.details !== null ? '\n' + activity.details : ''}\`\`\``, false );
			} else if ( activity.type === 'LISTENING' ) {
				embed.addField( 'Слушает ', `\`\`\`Исполнитель :: ${activity.state}${activity.details !== null ? '\n' + activity.details : ''} :: ${activity.assets.largeText}\`\`\``, false );
			} else if ( activity.type === 'WATCHING' ) {
				embed.addField( 'Смотрит ', `\`\`\`Название :: ${activity.name}${activity.details !== null ? '\n' + activity.details : ''}\`\`\``, false );
			}
		}
	}

	return interaction.reply( { embeds: [ embed ] } );
};
