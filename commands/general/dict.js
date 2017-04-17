const Commando = require('discord.js-commando');
const request = require('request');
const wordnet = require('wordnet');

module.exports = class dictCommand extends Commando.Command {
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

    async run(msg, args, client){
        let term = args.term;
        
        wordnet.lookup(term, function(err, definitions) {
            if (typeof definitions != 'undefined') {
                // Create fields array beforehand
                var fieldArray = [];
                // Only return up to three entries
                for (var i = 0; (i < 3) && (i < definitions.length); i++) {
                    fieldArray.push({
                        name: `${i + 1}. ${definitions[i]['meta']['synsetType']}`,
                        value: `${definitions[i]['glossary']}`,
                        inline: true
                    });
                }
                
                return msg.reply("", {embed: {
                    color: 3447003,
                    // Return title as upper case first letter
                    title: `${term.charAt(0).toUpperCase() + term.slice(1)}`,
                    fields: fieldArray
                }});
            } else {
                return msg.reply(`\`${term}\` did not match any results.`);
            }
        });
    
    }
}
