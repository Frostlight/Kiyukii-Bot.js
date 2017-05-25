const { Command } = require('discord.js-commando');
const moment = require('moment-timezone');
const { RichEmbed } = require('discord.js');
const { search } = require("fast-fuzzy");

module.exports = class WikiCommand extends Command {
    constructor(client) {
        super(client, {
            name: "time",
            group: "general",
            memberName: "time",
            description: "Looks up timepedia information.",
            examples: ["time London"],

            args: [
                {
                    key: 'timezone',
                    label: 'timezone',
                    prompt: 'Which timezone do you want to look up?',
                    type: 'string'
                }
            ]
        })
    }

    async run(message, args, client){
        // Get timezone from arguments
        let timezone = args.timezone;
        var timezone_list = moment.tz.names();
        
        // Fuzzy search to get an approximate timezone, use the first result which is more accurate
        var timezone_result = search(timezone, timezone_list)[0];
        
        // Format and display time
        if (typeof timezone_results != undefined) {
            console.log(timezone_result);
            
            // Adjust time to correct timezone according to query
            var time_now = moment().tz(timezone_result).format("dddd, MMMM Do YYYY, h:mm:ss a");
            
            const embed = new RichEmbed()
                .setColor(0xFFFFFF)
                .setThumbnail('http://i.imgur.com/YPVdDAM.png')
                .setTimestamp()
                .addField(`Time in ${timezone_result}`, time_now, true);
            return message.embed(embed);
        } else {
            return message.say(`\`${timezone}\` did not match any timezones.`);
        }
    }
}
