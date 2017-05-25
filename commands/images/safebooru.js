const { Command } = require('discord.js-commando');
const request = require('superagent');
const xml2js = require('xml2js');

module.exports = class safebooruCommand extends Command {
    constructor(client) {
        super(client, {
            name: "safebooru",
            group: "images",
            memberName: "safebooru",
            description: "Looks up pictures on Safebooru.",
            examples: ["safebooru Naruto"],

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
                .get('http://safebooru.org/index.php')
                .query({page: 'dapi'})
                .query({s: 'post'})
                .query({q: 'index'})
                .query({tags: tags});
                
            // Parse XML response
            // xml2js uses callbacks
            let parseString = xml2js.parseString;
            parseString(text, function(error, result) {
                if (!error) {
                    // The resulting array of entries
                    let resultArray = result['posts']['post'];
                    
                    if (typeof resultArray != 'undefined') {
                        // Pick a random element from the array and send the URL
                        var item = resultArray[Math.floor(Math.random()*resultArray.length)];
                        var url = "http:" + item['$']['file_url'];
                        
                        // Return image as a file embed
                        return message.say("", {file: url});
                        
                        // For extra information in embed
                        // Omitted for now
                        /*embed: {
                            color: 3447003,
                            title: `Gelbooru`,
                            url: "http://gelbooru.com/",
                            fields: [{
                                name: "Source",
                                value: item['$']['source'],
                                inline: true
                            }, 
                            {
                                name: "Tags",
                                value: item['$']['tags'],
                                inline: true
                            }]
                        }*/
                        
                    // No results to query
                    } else {
                        return message.say(`\`${tags}\` did not match any images.`);
                    }
                // Parse error
                } else {
                    console.log(error);
                    return message.say(`Something went wrong! Please try again later.`);
                }    
            });
        } catch (error) {
            console.log(error);
            return message.say(`Something went wrong! Please try again later.`);
        }
    }
}
