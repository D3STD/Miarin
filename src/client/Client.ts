import { MongoClient } from 'mongodb';
import { Client, Collection } from 'discord.js';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import fs from 'fs';
import { LibShoukaku } from '../libs/libshoukaku.js';

import { Command } from '../types/Command';

class Bot {
    public client: Client;
    public rest: REST;
    private config;
    public mongo: MongoClient;
    private _mongo: string;
    private token: string;
	public shoukaku: LibShoukaku;

    public commands: Collection<string, Command>;

	constructor( { mongo, token, config } ) {
		this.client = new Client( {
			presence: { activities: [ { name: 'русском поле эксперементов', type: 5 } ] },
			allowedMentions: {
				parse: []
			},
			messageCacheLifetime: 3600,
			messageSweepInterval: 1600,
			partials: [ 'MESSAGE', 'CHANNEL', 'REACTION' ],
			intents: 32767
		} );
		this.rest = new REST( { version: '9' } ).setToken( token );
		this.config = config;

        this.token = token;
        this._mongo = mongo;

		fs.readdirSync( './dist/events' ).filter( ( file ) => file.endsWith( '.js' ) ).forEach( async ( file ) => {
			const event = await import( `../events/${file}` );
			const name = file.split( '.' )[ 0 ];
			this.client.on( name, event.exec );
		} );

		this.commands = new Collection<string, Command>();
		fs.readdirSync( './dist/commands' ).filter( ( f ) => f.endsWith( '.js' ) ).forEach( async ( file ) => {
			const interaction = await import( `../commands/${file}` );
			this.commands.set( interaction.info.name, interaction );
		} );

		this.client.on( 'interactionCreate', async ( interaction ) => {
			if ( interaction.isAutocomplete() ) {
                const command = bot.commands.find( ( command ) => command.info.name === interaction.commandName );
				await command.executeAC( interaction );
			}
			if ( !interaction.isCommand() ) { return; }
			const command = this.commands.find( ( command ) => command.info.name === interaction.commandName );
    		try {
				if ( interaction.options?.getSubcommand(false) !== null ) {
					const subcommand = this.commands.find( c => c.info.name === interaction.options.getSubcommand() && c.parentOf === interaction.commandName );
					if ( subcommand ) await subcommand.execute( interaction );
				} else await command.execute( interaction );
    		} catch ( e ) {
    			return interaction.reply( { content: `Произошла ошибка! Сообщите о ней на сервер поддержки передав этот текст:\n\`\`\`js\nSlashCommand ERROR\nCommand: ${interaction.commandName}\n${e}\`\`\``, ephemeral: true } );
    		}
		} );
	}

	async init() {
		if ( this._mongo ) { this.mongo = await new MongoClient(this._mongo).connect(); }
		await this.client.login( this.token );
		this.shoukaku = new LibShoukaku( this.client, this.config.nodes, {
			moveOnDisconnect: false,
			resumable: true,
			resumableTimeout: 10,
			reconnectTries: 2,
			restTimeout: 10000
		} );
		return this;
	}

	get db() {
		return this.mongo.db( 'Miarin' );
	}

	async uploadInteraction( command, guild ) {
		const cmd = this.commands.find( ( c ) => c.info.name === command );
		if ( guild ) return await this.rest.setToken( this.token ).post( Routes.applicationGuildCommands( this.client.user.id, guild ), { body: cmd.info } );
		else return await this.rest.setToken( this.token ).post( Routes.applicationCommands( this.client.user.id ), { body: cmd.info } );
	}

	async reloadInteractions() {
        return new Promise( resolse => {
            this.commands = new Collection();
            fs.readdirSync( './src/Commands' ).filter( ( f ) => f.endsWith( '.js' ) ).forEach( ( file ) => {
                const interaction = require( `../Commands/${file}` );
                this.commands.set( interaction.info?.name, interaction );
            } );
            resolse(this.commands)
        } )
	}
}

export { Bot };