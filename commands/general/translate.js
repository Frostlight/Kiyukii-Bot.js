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
        
        // TODO: Error check: text is too long
        // TODO: Error check: invalid
        console.log("config key = " + config.microsoft_azure_api_token);
        console.log("args = " + text);
    }
}
