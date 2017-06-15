// All credits for starboard system to: https://github.com/WeebDev/Commando
const path = require('path');
const { URL } = require('url');

module.exports = class Starboard {
	static async createStar(message, starboardChannel, starBy) {
		message.content = message.content.length <= 1024 ? message.content : `${message.content.substr(0, 1021)}...`;
		const starboardMessage = await starboardChannel.send({ embed: Starboard._starEmbed(message) });
	}
    
	static _starEmbed(message) {
		let attachmentImage;
		const extensions = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp']);
		const linkRegex = /https?:\/\/(?:\w+\.)?[\w-]+\.[\w]{2,3}(?:\/[\w-_\.]+)+\.(?:png|jpg|jpeg|gif|webp)/; // eslint-disable-line no-useless-escape, max-len

		if (message.attachments.some(attachment => {
			try {
				const url = new URL(attachment.url);
				const ext = path.extname(url.pathname);
				return extensions.has(ext);
			} catch (error) {
				if (error.message !== 'Invalid URL') {
                    console.log(error);
                }

				return false;
			}
		})) attachmentImage = message.attachments.first().url;

		if (!attachmentImage) {
			const linkMatch = message.content.match(linkRegex);
			if (linkMatch) {
				try {
					const url = new URL(linkMatch[0]);
					const ext = path.extname(url.pathname);
					if (extensions.has(ext)) {
                        attachmentImage = linkMatch[0]; // eslint-disable-line max-depth
                    } 
				} catch (error) {
					if (error.message === 'Invalid URL') {
                        console.log('ERROR: No valid image link.'); // eslint-disable-line max-depth
                    }
					console.log(error);
				}
			}
		}

		return {
			author: {
				icon_url: message.author.displayAvatarURL, // eslint-disable-line camelcase
				name: `${message.author.username}#${message.author.discriminator}`
			},
			color: 0xFFAC33,
			fields: [
				/*{
					name: 'ID',
					value: message.id,
					inline: true
				},*/
				{
					name: 'Channel',
					value: message.channel.toString(),
				},
				{
					name: 'Message',
					value: message.content ? message.content : '\u200B'
				}
			],
			image: { url: attachmentImage || undefined },
			timestamp: message.createdAt
		};
	}
};
