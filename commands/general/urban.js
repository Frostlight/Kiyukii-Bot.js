const Commando = require('discord.js-commando');
const request = require('request');
const urban = require('relevant-urban');

module.exports = class UrbanCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: "urban",
            group: "general",
            memberName: "urban",
            description: "Looks up definitions on Urban Dictionary.",
            examples: ["urban Happy"],

            args: [
                {
                    key: 'term',
                    label: 'term',
                    prompt: 'Which term do you want to look up?',
                    type: 'string'
                }
            ]
        })
    }

    async run(msg, args, client){
        let term = args.term;
        
        // Set up promise and then() for urban dictionary look up
        var urbanPromise = urban.all(term);
        urbanPromise.then(function(data) {
            // Create fields array beforehand
            var fieldArray = [];
            var totalChars = 0;
            for (var i = 0; (i < 3) && (i < data.length); i++) {
                // Trim definition/example if it's too long
                var definition = data[i]['definition'];
                if (definition.length > 800) {
                    definition = definition.substring(0, 700) + "...";
                }
                var example = data[i]['example'];
                if (example.length > 100) {
                    example = definition.substring(0, 200) + "...";
                }
                
                // Stop early if we reached discord message limit (2000 chars)
                // Use a 50 char buffer here just in case, so 1950 max characters
                totalChars += definition.length + example.length;
                
                if (totalChars >= 1950) {
                    break;
                }
                
                fieldArray.push({
                    name: `${i + 1}. ${data[i]['word']}`,
                    value: `${definition}\
                        \n**Example:**\n${example}`,
                    inline: true
                });
            };
            
            return msg.reply("", {embed: {
                color: 3447003,
                title: `Urban Dictionary`,
                url: "http://www.urbandictionary.com/",
                fields: fieldArray
            }});
        }, function(err) {
            return msg.reply(`\`${term}\` did not match any results.`);
        });
    }
}
