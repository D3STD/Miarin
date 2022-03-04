import { MessageActionRow, MessageButton, CommandInteraction, ButtonInteraction } from 'discord.js';
import { ShoukakuPlayer } from 'shoukaku';

export class ButtonsRowController {
    public interaction: CommandInteraction;
    public player: ShoukakuPlayer;

    constructor( interaction: CommandInteraction, player: ShoukakuPlayer ) {
        this.interaction = interaction;
        this.player = player;
    }

    async resolve( interactionButton: ButtonInteraction ) {
        console.log(interactionButton.customId);
        switch(interactionButton.customId) {
            case 'repeat':
                return bot.shoukaku.setPlayerSettings( this.interaction.guild.id, {
                    repeat: !bot.shoukaku.getPlayerSettings( this.interaction.guild.id )?.repeat ?? true,
                    pause: bot.shoukaku.getPlayerSettings( this.interaction.guild.id )?.pause ?? false
                } );

            case 'volumeup':
                return this.player.filters.volume += 0.5;
            
            case 'volumedown':
                return this.player.filters.volume -= 0.5;

            case 'pause':
                bot.shoukaku.setPlayerSettings( this.interaction.guild.id, {
                    repeat: bot.shoukaku.getPlayerSettings( this.interaction.guild.id )?.repeat ?? false,
                    pause: !bot.shoukaku.getPlayerSettings( this.interaction.guild.id )?.pause ?? true
                } );

                return this.player.setPaused( bot.shoukaku.getPlayerSettings( this.interaction.guild.id ).pause );

            case 'stop':
                bot.shoukaku.removeQuery( this.interaction.guild.id, true );
                return this.player.stopTrack();

            case 'next':
                return this.player.stopTrack();
        }
        return this.buildRow();
    }

    buildRow(): Array<MessageActionRow> {
        return [
            new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId( 'repeat' )
                        .setLabel( 'Повтор' )
                        .setStyle( bot.shoukaku.getPlayerSettings( this.interaction.guild.id )?.repeat === true ? 'DANGER' : 'PRIMARY' )
                        .setEmoji( '🔁' ),
                )
                .addComponents(
                    new MessageButton()
                        .setCustomId( 'volumeup' )
                        .setLabel( 'Громкость +' )
                        .setStyle( 'PRIMARY' )
                        .setEmoji( '🔊' )
                        .setDisabled( this.player.filters.volume >= 1.5 ),
                )
                .addComponents(
                    new MessageButton()
                        .setCustomId( 'volumedown' )
                        .setLabel( 'Громкость -' )
                        .setStyle( 'PRIMARY' )
                        .setEmoji( '🔉' )
                        .setDisabled( this.player.filters.volume <= 0 ),
                )
                .addComponents(
                    new MessageButton()
                        .setCustomId( 'pause' )
                        .setLabel( 'Пауза' )
                        .setStyle( bot.shoukaku.getPlayerSettings( this.interaction.guild.id )?.pause === true ? 'DANGER' : 'PRIMARY' )
                        .setEmoji( '⏸' ),
                ),
            new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId( 'stop' )
                        .setLabel( 'Остановить' )
                        .setStyle( 'PRIMARY' )
                        .setEmoji( '⏹' )
                )
                .addComponents(
                    new MessageButton()
                        .setCustomId( 'next' )
                        .setLabel( 'Следующая' )
                        .setStyle( 'PRIMARY' )
                        .setEmoji( '⏭' )
                        .setDisabled( !( bot.shoukaku.getQuery( this.interaction.guild.id )?.length > 1 ) )
                )
        ]
    }
}