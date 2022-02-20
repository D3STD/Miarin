import { Shoukaku, Libraries, NodeOptions } from 'shoukaku';
import { Collection } from 'discord.js';
import * as liblog from '../libs/logger.js';

import { QueryElement } from '../types/QueryElement';

export class LibShoukaku {
	public query: Collection<string, Array<QueryElement>> = new Collection()
    public player: Shoukaku;

    constructor( nodes: Array<NodeOptions>, options?: Object )
    {
        this.player = new Shoukaku( new Libraries.DiscordJS(bot), nodes, options );

        this.player.on( 'ready', name => liblog.success( `Нода ${name} запущенаи готова к работе`, 'Shoukaku' ) )
        this.player.on( 'error', ( name, error ) => liblog.error( `Ошибка в ноде: ${name}`, error, 'Shoukaku' ) )
        this.player.on( 'close', ( name, code, reason ) => liblog.info( `Нода: ${name}, Код закрытия: ${code}\nПричина: ${reason?.length > 1 ? reason : 'Без причины'}`, 'Shoukaku' ) )
        this.player.on( 'disconnect', ( name, reason ) => liblog.info( `Нода: ${name}\nПричина: ${reason?.length > 1 ? reason : 'Без причины'}`, 'Shoukaku' ) )
    }

    get client() {
        return this.player;
    }

    async addQuery( id, element: QueryElement ) {
        if ( !this.query.has(id) ) this.query.set( id, [] );

        this.query.get( id ).push( element );
        bot.client.emit( 'queryAdd', {
            id,
            element
        } );

        return this.query.get( id );
    }

    removeQuery( id: string, position?: number ) {
		if ( !position ) return this.query.delete( id );
        else {
            const noElement = this.query.get( id ).splice(0, 1);
			return this.query.set( id, noElement );
		}
	}
}