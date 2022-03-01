import shoukaku from 'shoukaku';
const { Shoukaku, Libraries } = shoukaku;
import { NodeOptions } from 'shoukaku';
// Жс хуйня не дает сделать нормальный импорт
import { Collection } from 'discord.js';
import * as liblog from '../libs/logger.js';

import { QueryElement } from '../types/QueryElement';
import { PlayerSettings } from '../types/PlayerSettings.js';

export class LibShoukaku {
	public query: Collection<string, Array<QueryElement>> = new Collection()
    public playerSettings: Collection<string, PlayerSettings> = new Collection()
    public player;

    constructor( client, nodes: Array<NodeOptions>, options?: Object )
    {
        this.player = new Shoukaku( new Libraries.DiscordJS(client), nodes, options );

        this.player.on( 'ready', name => liblog.success( `Нода ${name} запущенаи готова к работе`, 'Shoukaku' ) )
        this.player.on( 'error', ( name, error ) => liblog.error( `Ошибка в ноде: ${name}`, error, 'Shoukaku' ) )
        this.player.on( 'close', ( name, code, reason ) => liblog.info( `Нода: ${name}, Код закрытия: ${code}\nПричина: ${reason?.length > 1 ? reason : 'Без причины'}`, 'Shoukaku' ) )
        this.player.on( 'disconnect', ( name, reason ) => liblog.info( `Нода: ${name}\nПричина: ${reason?.length > 1 ? reason : 'Без причины'}`, 'Shoukaku' ) )
    }

    get client() {
        return this.player;
    }

    addQuery( id, element: QueryElement ): Array<QueryElement> {
        if ( !this.query.has(id) ) this.query.set( id, [] );

        this.query.get( id ).push( element );
        bot.client.emit( 'queryAdd', {
            id,
            song: element
        } );

        return this.query.get( id );
    }

    removeQuery( id: string, full: boolean = false ): Array<QueryElement> {
		if ( full ) this.query.delete( id );
        else if ( !full ) {
            const noElement = this.query.get( id ).splice(0, 1);
			this.query.set( id, noElement );
		}

        return this.query.get( id );
	}

    getQuery( id: string ): Array<QueryElement> {
        return this.query.get( id );
    }

    setPlayerSettings( id: string, settings: PlayerSettings ): void {
		this.playerSettings.set( id, settings );
        return;
	}

	getPlayerSettings( id: string ): PlayerSettings {
		return this.playerSettings.get( id ) ?? null;
	}
}
