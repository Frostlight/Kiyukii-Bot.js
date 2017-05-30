const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const request = require('superagent');

// Source: https://github.com/dragonfire535/xiaobot/blob/master/commands/games/quiz.js
module.exports = class QuizCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'quiz',
            group: 'fun',
            memberName: 'quiz',
            description: 'Answer a quiz question.'
        });
    }

    async run(message) {
        try {
            const { body } = await request
                .get('http://jservice.io/api/random')
                .query({count: 1});
            const answer = body[0].answer.toLowerCase().replace(/(<i>|<\/i>)/g, '');
            
            const embed = new RichEmbed()
                .setTitle('You have **15** seconds to answer this question:')
                .setDescription(`**Category: ${body[0].category.title}** for ${body[0].value} points\n\n${body[0].question}`);
            message.embed(embed);
            try {
                const collected = await message.channel.awaitMessages(res => res.author.id === message.author.id, {
                    max: 1,
                    time: 15000,
                    errors: ['time']
                });
                if (collected.first().content.toLowerCase() !== answer)
                    return message.say(`The correct answer is: \`${answer}\`.`);
                return message.say(`Good job, the correct answer is: \`${answer}\`.`);
            } catch (error) {
                return message.say(`Time up! The correct answer is: \`${answer}\`.`);
            }
        } catch (error) {
            console.log(error);
            return message.reply(`Something went wrong! Please try again later.`)
        }
    }
};
