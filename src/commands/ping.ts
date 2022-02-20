import { MessageEmbed } from 'discord.js';

export const info = {
    name: 'ping',
    description: 'Получить WS RTA и время ответа Discord API'
};

export const execute = async( interaction ) => {
    const recieved = Date.now();

    const embed = new MessageEmbed()
        .setAuthor({ name: bot.client.user.tag, iconURL: bot.client.user.avatarURL({ size: 256 }) })
        .setColor('#29e3ab')
        .setDescription(`\`\`\`js\n✉️ MESSAGE  : ${Date.now() - recieved}ms\n🔌WEBSOCKET : ${bot.client.ws.ping}ms\n🔑 API      : IN_DEVELOPMENT\`\`\``);

    return interaction.reply({ embeds: [embed] });
};
