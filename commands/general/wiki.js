const { Command } = require('discord.js-commando');
const request = require('superagent');

module.exports = class WikiCommand extends Command {
    constructor(client) {
        super(client, {
            name: "wiki",
            group: "general",
            memberName: "wiki",
            description: "Looks up Wikipedia information.",
            examples: ["wiki Blizzard"],

            args: [
                {
                    key: 'wiki',
                    label: 'wiki',
                    prompt: 'Which wiki page do you want to look up?',
                    type: 'string'
                }
            ]
        })
    }

    async run(message, args, client){
        const { wiki } = args;
        try {
            // Form query and send GET request
            const { body } = await request
                .get('https://en.wikipedia.org/w/api.php')
                .query({action: 'opensearch'})
                .query({format: 'json'})
                .query({namespace: '0'})
                .query({limit: '1'})
                .query({search: wiki});
                
            // Return the wiki URL if there are any results for the search
            let wikiPage = body[3][0];
            console.log(wikiPage);
            if (typeof wikiPage != 'undefined' && wikiPage != '') {
                return message.say(wikiPage);
            }
            else {
                return message.say(`\`${wiki}\` did not match any wiki pages.`)
            }
        } catch (error) {
            console.log(error);
            return message.say(`Something went wrong! Please try again later.`);
        }
    }
}
