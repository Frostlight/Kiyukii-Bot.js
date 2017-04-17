const Commando = require('discord.js-commando');
const request = require('request');

module.exports = class GranblueCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: "gbf",
            group: "mobage",
            memberName: "gbf",
            description: "Looks up Granblue wiki information.",
            examples: ["gbf Albert"],

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
        request(`https://gbf.wiki/api.php?action=opensearch&format=json&namespace=0&limit=1&search=${wiki}`, function(error, response, body) {
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
