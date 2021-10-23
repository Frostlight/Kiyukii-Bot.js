const { Command } = require('discord.js-commando');
const request = require('superagent');
const xml2js = require('xml2js-es6-promise');

module.exports = class GelbooruCommand extends Command {
    constructor(client) {
        super(client, {
            name: "gelbooru",
            group: "images",
            memberName: "gelbooru",
            description: "Looks up pictures on Gelbooru (may be NSFW).",
            examples: ["gelbooru Inuyasha"],

            args: [
                {
                    key: 'tags',
                    label: 'tags',
                    prompt: 'Which tags do you want to look up?',
                    type: 'string'
                }
            ]
        })
    }

    async run(message, args, client){
        let { tags } = args;
        
        try {
            // superagent request response text is xml format
            const { text } = await request
                .get('http://gelbooru.com/index.php')
                .query({page: 'dapi'})
                .query({s: 'post'})
                .query({q: 'index'})
                .query({tags: tags});
                
            // Parse XML response to an object
            let parseString = await xml2js(text);
            let resultArray = parseString['posts']['post'];
            
            if (typeof resultArray != 'undefined') {
                // Pick a random element from the array and send the URL
                var item = resultArray[Math.floor(Math.random()*resultArray.length)];
                var url = item['$']['file_url'];
                
                // Return url of result image
                return message.say(url);
            // No results to query
            } else {
                return message.say(`\`${tags}\` did not match any images.`);
            }
        } catch (error) {
            console.log(error);
            return message.say(`Something went wrong! Please try again later.`);
        }
    }
}
