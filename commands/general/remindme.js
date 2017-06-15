const { Command } = require('discord.js-commando');
const moment = require('moment');
const chrono = require('chrono-node');
const { stripIndents } = require('common-tags');

// Credits to: https://github.com/WeebDev/Commando/
module.exports = class RemindMeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'remindme',
			group: 'general',
			memberName: 'remindme',
			description: 'Reminds you of something.',
            examples: ["remindme Appointment in 2 hours"],
			guildOnly: true,
            
			args: [
				{
					key: 'text',
					label: 'text',
					prompt: 'What would you like me to remind you about?',
					type: 'string',
					validate: text => {
						const parsedTime = chrono.parseDate(text);
						if (!parsedTime) {
                            return `please provide a valid starting time.`;
                        }
						return true;
					}
				}
			]
		});
	}
    
	async run(message, { text }) {
        // Parse text into chrono date
        const parsedDate = chrono.parse(text);
        
        // Get relevant results from chrono date object
        const dateText = parsedDate[0].text; // The text parsed to get date (e.g. "at 4pm tomorrow")
        const dateTime = parsedDate[0].start.date(); // DateTime object parsed
        
        // Get event title by removing date-related text from text given
        var eventTitle = text.replace(dateText, '');
        
		const time = dateTime.getTime() - Date.now();
		const remindInitiate = await message.say(stripIndents`
			${message.author}, I will remind you about \`${eventTitle}\` ${moment().add(time, 'ms').fromNow()}.`);
		const remindResult = await new Promise(resolve => {
			setTimeout(() => resolve(message.say(stripIndents`
				${message.author}, you wanted me to remind you of: \`${eventTitle}\``)), time);
		});

		return [remindInitiate, remindResult];
	}
};
