const Commando = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
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

    async run(message, args, client){
        let { term } = args;
        
        try {
            // Await promise for urbandictionary lookup
            // Invalid lookups generate a TypeError
            var urban = await urban.all(term);
            
            // Create RichEmbed to return beforehand and add definitions to it later
            var embed = new RichEmbed()
                    .setColor(0x808080)
                    .setTitle('Urban Dictionary')
                    .setURL('http://www.urbandictionary.com')
                    .setTimestamp();
            
            // Field limit is 1024, so we allocate it according to this arbitrary split:
            // 3/4 to the definition, and 1/4 to the example
            // Subtract 14 characters from the example allocation since this small string to indicate example is added:
            // \n**Example:**\n
            
            // Error for reference:
            // (node:18692) UnhandledPromiseRejectionWarning: Unhandled promise rejection (reje
            // ction id: 1): RangeError: RichEmbed field values may not exceed 1024 characters.
            const charsForEach = 1024;
            const charsForDefinition = charsForEach  * (3/4);
            const charsForExample = charsForEach * (1/4) - 14;
            
            for (var i = 0; (i < 3) && (i < urban.length); i++) {
                // Definition and examples are vars because we trim them if their length exceeds the limit
                var definition = urban[i]['definition'];
                var example = urban[i]['example'];
                
                // Case where no example is provided, the text limit in this case is charsForEach
                if (example.length == 0 && definition.length > charsForEach) {
                    definition = definition.substring(0, charsForEach - 3) + "...";
                // Case where an example is provided, the text limit in this case is charsForDefinition
                } else {
                    // Definition check
                    // Add more characters to the definition limit depending on the length of the example
                    const charsForDefinitionNew = (example.length > charsForExample) ? charsForDefinition : 
                        (charsForDefinition + (charsForExample - example.length));
                    if (definition.length > charsForDefinitionNew) {
                        definition = definition.substring(0, charsForDefinitionNew - 3) + "...";
                    }
                    
                    // Example check
                    if (example.length > charsForExample) {
                        example = example.substring(0, charsForExample - 3) + "...";
                    }
                }

                // Combine string for definition and example (if example exists)
                var definitionString = definition + ((example.length > 0) ? `\n**Example:**\n${example}` : '');
                
                // Add definition to RichEmbed response
                embed.addField(`${i + 1}. ${urban[i]['word']}`, definitionString, true);
            };
            
            return message.embed(embed);
        } catch (error) {
            if (error instanceof TypeError) {
                // Lookup failed (no results)
                return message.say(`\`${term}\` did not match any results.`);
            } else {
                // Any other error
                console.log(error);
                return message.reply(`Something went wrong! Please try again later.`)
            }
        }
    }
}
