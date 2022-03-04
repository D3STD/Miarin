import { MessageEmbed } from 'discord.js';

export const info = {
    name: 'guild',
    description: 'Получить информацию о сервере'
};

const levels = {
	NONE: '<:no:845640305310433280> Нету',
	LOW: '<:small:877601614553284618> Низкий',
	MEDIUM: '<:medium:877601614691729439> Средний',
	HIGH: '<:high:877601614565888031> Высокий',
	VERY_HIGH: '<:high:877601614565888031> Очень высокий'
};

export const execute = async( interaction ) => {
	const guild = interaction.guild;
	await guild.members.fetch();
	await guild.channels.fetch();
	const embed = new MessageEmbed()
		.setTitle( `${guild.name}` )
	// @ts-ignore
		.setColor( '#5b4bff' )
		.setThumbnail( guild.bannerURL() !== null ? guild.iconURL( { size: 2048, format: 'png', dynamic: true } ) : '' )
		.setImage( guild.bannerURL() || ( guild?.iconURL( { size: 2048, format: 'png', dynamic: true } ) || null ) )
		.setDescription( 'Здесь находится основная информация об этом сервере' )
		.addField( 'Информация', `<:clock:843272923074134037> Сервер создан: ${guild.createdAt.toLocaleString( 'ru' )}\n<:crownn:751214509968064563> Владелец: ${bot.client.users.cache.get( guild.ownerId ).tag}\n<:ok:843263440171696190> Уровень верефикации: ${levels[ guild.verificationLevel ]}`, false )
		.addField( 'Статистика', `<:users:843272454423183412> Юзеров: ${guild.members.cache.size}\n<:chat:877601614473613333> Чатов: ${guild.channels.cache.size}`, true )
		.addField( 'Каналы', `<:text:877604756133142608> Текстовые: ${guild.channels.cache.filter( ( t ) => t.type === 'GUILD_TEXT' ).size}\n<:voice:877604755730497618> Голосовые: ${guild.channels.cache.filter( ( t ) => t.type === 'GUILD_VOICE' ).size}`, true )
		.addField( 'Участники', `<:user:877607419319058482> Людей: ${interaction.guild.members.cache.filter( ( m ) => m.user.bot !== true ).size}\n<:bot:877607419428110356> Ботов: ${interaction.guild.members.cache.filter( ( m ) => m.user.bot === true ).size}`, true );

	return interaction.reply( { embeds: [ embed ] } );
};
