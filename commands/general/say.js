const { Command } = require('discord.js-commando');
const request = require('superagent');

module.exports = class SayCommand extends Command {
    constructor(client) {
        super(client, {
            name: "say",
            group: "general",
            memberName: "say",
            description: "Makes me say something.",
            examples: ["say Hello"],

            args: [
                {
                    key: 'say',
                    label: 'say',
                    prompt: 'What would you like me to say?',
                    type: 'string'
                }
            ]
        })
    }

    async run(message, args){
        // Delete user's comment, replace it with bot's.
        message.delete();
    	message.say(args);
    }
}
