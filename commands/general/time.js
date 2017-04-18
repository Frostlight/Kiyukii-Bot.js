const Commando = require('discord.js-commando');
const request = require('request');
const moment = require('moment-timezone');
const {search} = require("fast-fuzzy");

module.exports = class WikiCommand extends Commando.Command {
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

    async run(msg, args, client){
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
            
            return msg.reply("", {embed: {
                color: 16777215,
                thumbnail: {
                    url: `http://i.imgur.com/YPVdDAM.png`
                },
                fields: [{
                    name: `Time in ${timezone_result}`,
                    value: time_now,
                    inline: true
                }]
            }});
        } else {
            return msg.reply(`\`${timezone}\` did not match any timezones.`)
        }
        
      
    }
}
