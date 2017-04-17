const Commando = require('discord.js-commando');
const request = require('request');
const xml2js = require('xml2js');

module.exports = class safebooruCommand extends Commando.Command {
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

    async run(msg, args, client){
        let tags = args.tags;
        
        request(`http://safebooru.org/index.php?page=dapi&s=post&q=index&tags=${tags}`, function(error, response, body) {
            if (!error && response.statusCode == 200) { 
                // Parse XML response
                let parseString = xml2js.parseString;
                parseString(body, function(err, result) {
                    if (!error) {
                        // The resulting array of entries
                        let resultArray = result['posts']['post'];
                        
                        // Pick a random element from the array and send the URL
                        var item = resultArray[Math.floor(Math.random()*resultArray.length)];
                        var url = "http:" + item['$']['file_url'];
                        
                        // Return image as a file embed
                        return msg.reply("", {file: url});
                    // Unknown error occured?
                    } else {
                        console.log(err);
                        return msg.reply(`Something went wrong! Please try again later.`);
                    }
                });
            } else {
                return msg.reply(`\`${tags}\` did not match any images.`);
            }
        })
    }
}
