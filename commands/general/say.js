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
                    key: 'text',
                    label: 'text',
                    prompt: 'What would you like me to say?',
                    type: 'string'
                }
            ]
        })
    }

    async run(message, args){
        const { text } = args;
        // Delete user's comment, replace it with bot's
        if (message.mentions.channels.first()) {
            message.delete().catch(console.error);
            message.mentions.channels.first().send(text.split(" ").slice(1).join(" "));
        } else {
            message.channel.send(text);
            message.delete().catch(console.error);
        }
    }
}
