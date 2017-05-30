const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const MsTranslator = require('mstranslator');

// Use path to access the confirguation file, located two directories up
const path = require('path');
const config = require(path.dirname(path.dirname(__dirname)) + '/config.json');

module.exports = class translateCommand extends Command {
    constructor(client) {
        super(client, {
            name: "translate",
            group: "general",
            memberName: "translate",
            description: "Translates text to English.",
            examples: ["translate Happy"],

            args: [
                {
                    key: 'text',
                    label: 'text',
                    prompt: 'What text do you want to translate to English?',
                    type: 'string'
                }
            ]
        })
    }

    async run(message, args, client){
        let { text } = args;
        
        // Error check: text is too long
        if (text.length >= 2000) {
            return message.say('The text given is too long! The maximum length is 2000 characters.');
        }
        
        // TODO: Error check: invalid key given
        
        // Create a client for use of MSTranslator services
        const translate_client = new MsTranslator({api_key: config.microsoft_translate_api_token}, true);
        
        // Detect the language of the text submitted
        var params = {text: text};
        translate_client.detect(params, function(error, language) {
            if (!error) {
                // Translate the text to English if the language detected isn't already english
                if (language != 'en') {
                    var params = {text: text, from: language, to: 'en'};
                    
                    // This is kind of callback hell already #blamePackageNoPromiseSupport
                    translate_client.translate(params, function(error, result) {
                        if (!error) {
                            // Resulting translated text is stored in result
                            const embed = new RichEmbed()
                                .setColor(0xFFFFFF)
                                .setThumbnail('http://i.imgur.com/Qt8Ncr1.png')
                                .setTimestamp()
                                .addField(`Detected Language: ${language}`, result, true);
                            return message.embed(embed);
                        } else {
                            // Translate Failed
                            console.log(error);
                            return message.reply(`Something went wrong! Please try again later.`)
                        }
                    });
                } else {
                    // Language is english
                    return message.say('The text given is already in English!');
                }
            } else {
                // Detect language failed
                console.log(error);
                return message.reply(`Something went wrong! Please try again later.`)
            }
        });
    }
}
