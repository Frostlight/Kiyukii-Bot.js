const { Command } = require('discord.js-commando');
const request = require('superagent');
const xml2js = require('xml2js-es6-promise');

module.exports = class kyuuCommand extends Command {
    constructor(client) {
        super(client, {
            name: "kyuu",
            group: "images",
            memberName: "kyuu",
            description: "Looks up pictures of Izumi Sagiri."
        })
    }

    async run(message, client){
        try {
            // superagent request response text is xml format
            const { text } = await request
                .get('http://safebooru.org/index.php')
                .query({page: 'dapi'})
                .query({s: 'post'})
                .query({q: 'index'})
                .query({tags: 'izumi_sagiri'});
                
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
