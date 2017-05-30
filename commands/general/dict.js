const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const wordnet = require('wordnet');

module.exports = class dictCommand extends Command {
    constructor(client) {
        super(client, {
            name: "dict",
            group: "general",
            memberName: "dict",
            description: "Looks up definitions on the english dictionary.",
            examples: ["dict Happy"],

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

    async run(message, args, client){
        let { term } = args;
        
        // wordnet only supports callbacks for now
        wordnet.lookup(term, function(error, definitions) {
            if (typeof definitions != 'undefined') {
                // Create RichEmbed to return beforehand and add definitions to it later
                var embed = new RichEmbed()
                    .setColor(0xE6E0B0)
                    .setTitle(term.charAt(0).toUpperCase() + term.slice(1))
                    .setTimestamp();
                    
                // Only return up to three entries
                for (var i = 0; (i < 3) && (i < definitions.length); i++) {
                    embed.addField(`${i + 1}. ${definitions[i]['meta']['synsetType']}`,
                        definitions[i]['glossary'], true);
                }
                
                return message.embed(embed);
            } else {
                return message.say(`\`${term}\` did not match any results.`);
            }
        });
    
    }
}
