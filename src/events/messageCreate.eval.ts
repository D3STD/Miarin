import { inspect } from 'util';

export const exec = async ( message ) => {
	if ( ![ '652025414390120459' ].includes( message.author.id ) ) { return; }
	if ( !message.content.startsWith( '$eval' ) ) { return; }

	const arg: string = message.content.slice( 5 ).trim();
	try {
		const evaled = await eval( arg );

		if ( !message.deleted && [ 'READ_MESSAGE_HISTORY', 'ADD_REACTIONS' ].every( ( perm ) => message.channel.permissionsFor( message.guild.me ).has( perm ) ) ) { message.react( 'develop_help:751898528086884472' ); }

		if ( evaled === undefined ) { return; }
		const text = inspect( evaled, { depth: 0, maxArrayLength: 50 } );
		if ( text.length > 1990 ) { return; }
		await message.channel.send( `\`\`\`js\n${text}\`\`\`` ).catch( () => {} );
	} catch ( error ) {
		if ( !message.deleted && [ 'READ_MESSAGE_HISTORY', 'ADD_REACTIONS' ].every( ( perm ) => message.channel.permissionsFor( message.guild.me ).has( perm ) ) ) { message.react( 'meme_cryFacePalm:877275547263197204' ); }
		await message.channel.send( `\`\`\`js\n${error}\`\`\`` ).catch( () => {} );
	}
};