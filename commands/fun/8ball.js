const { Command } = require('discord.js-commando');

module.exports = class EightBallCommand extends Command {
    constructor(client) {
        super(client, {
            name: "8ball",
            group: "fun",
            memberName: "8ball",
            description: "Find out if something will happen",
            examples: ["8ball Am I going to get lucky tomorrow?"]
        })
    }

    async run(message, client){
        const answers = [
          'Maybe.', 'Certainly not.', 'I hope so.', 'Not in your wildest dreams.',
          'There is a good chance.', 'Quite likely.', 'I think so.', 'I hope not.',
          'I hope so.', 'Never!', 'Fuhgeddaboudit.', 'Ahaha! Really?!?', 'Pfft.',
          'I\'m sorry.', 'Hell, yes.', 'Hell to the no.', 'The future is bleak.',
          'The future is uncertain.', 'I would rather not say.', 'Who cares?',
          'Possibly.', 'Never, ever, ever.', 'There is a small chance.', 'Yes!'];
        return message.say(answers[Math.floor(Math.random() * answers.length)]);
    }
}
