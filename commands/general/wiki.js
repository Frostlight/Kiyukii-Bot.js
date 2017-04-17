const Commando = require('discord.js-commando');
const request = require('request');

module.exports = class WikiCommand extends Commando.Command {
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

    async run(msg, args, client){
        let wiki = args.wiki;
        request(`https://en.wikipedia.org/w/api.php?action=opensearch&format=json&namespace=0&limit=1&search=${wiki}`, function(error, response, body) {
            if (!error && response.statusCode == 200) { 
                let wikiPage = JSON.parse(body)[3];

                // Return the wiki URL if there are any results for the search
                if (typeof wikiPage != 'undefined' && wikiPage != '') {
                    return msg.reply(`${wikiPage}`);
                }
                else {
                    return msg.reply(`\`${wiki}\` did not match any wiki pages.`)
                }
            }
        })
    }
}
