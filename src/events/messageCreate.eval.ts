import { inspect } from 'util';

export const exec = async ( message ) => {
	if ( ![ '652025414390120459' ].includes( message.author.id ) ) { return; }
	if ( !message.content.startsWith( '$eval' ) ) { return; }

	const arg: string = message.content.slice( 5 ).trim();
	try {
		const evaled = await eval( arg );

		if ( [ 'READ_MESSAGE_HISTORY', 'ADD_REACTIONS' ].every( ( perm ) => message.channel.permissionsFor( message.guild.me ).has( perm ) ) ) { message.react( 'okeh:911304732310642698' ); }

		if ( evaled === undefined ) { return; }
		const text = inspect( evaled, { depth: 0, maxArrayLength: 50 } );
		if ( text.length > 1990 ) { return; }
		await message.channel.send( `\`\`\`js\n${text}\`\`\`` ).catch( () => {} );
	} catch ( error ) {
		if ( [ 'READ_MESSAGE_HISTORY', 'ADD_REACTIONS' ].every( ( perm ) => message.channel.permissionsFor( message.guild.me ).has( perm ) ) ) { message.react( 'a_NePovezlo:859422022882557952' ); }
		await message.channel.send( `\`\`\`js\n${error}\`\`\`` ).catch( () => {} );
	}
};