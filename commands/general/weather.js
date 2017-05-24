const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const request = require('superagent');

module.exports = class WeatherCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'weather',
            group: 'general',
            memberName: 'weather',
            description: 'Searches weather for a specified location.',
            examples: ['weather San Francisco'],
            args: [{
                key: 'location',
                prompt: 'What location would you like to get the current weather for?',
                type: 'string'
            }]
        });
    }

    async run(msg, args) {
        const { location } = args;
        try {
            // superagent request body is already parsed into a JSON object
            const { body } = await request
                .get('https://query.yahooapis.com/v1/public/yql')
                .query({q: `select * from weather.forecast where u=\'C\' AND woeid in (select woeid from geo.places(1) where text="${location}")`})
                .query({format: 'json'});
                
            if (body.query.count >= 1) {
                const data = body.query.results.channel;
                const embed = new RichEmbed()
                .setColor(0xADD8E6)
                .setThumbnail('http://i.imgur.com/DjfE3H4.png')
                .setURL(data.link)
                .setTimestamp()
                .addField(`Weather in ${data.location.city}, ${data.location.region}, ${data.location.country}`,
                    `${data.item.condition.temp}°C ${data.item.condition.text}`, true)
                return msg.embed(embed);
            } else {
                return msg.reply(`\`${location}\` did not match any locations.`)
            }
        } catch (err) {
            console.log(err);
            return msg.reply(`Something went wrong! Please try again later.`)
        }
    }
};
