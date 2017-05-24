const Commando = require('discord.js-commando');
const { RichEmbed } = require('discord.js');

module.exports = class GeneralCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: "info",
            group: "general",
            memberName: "info",
            description: "Bot information.",
            examples: ["info"]
        })
    }

    async run(message, client){
        const embed = new RichEmbed()
            .setColor(0x3498DB)
            .setTitle(`${this.client.user.username}#${this.client.user.discriminator}`)
            .setURL('https://github.com/Frostlight/Kiyukii-Bot.js')
            .setThumbnail(this.client.user.avatarURL)
            .setTimestamp()
            .addField('Information', `**Servers:** ${this.client.guilds.array().length}\n**Since:** ${this.client.user.createdAt.toDateString()}`, true);
        return message.embed(embed);
    }
}