const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const request = require('superagent');

module.exports = class ShadowverseCommand extends Command {
    constructor(client) {
        super(client, {
            name: "sv",
            group: "mobage",
            memberName: "sv",
            description: "Looks up Shadowverse card information.",
            examples: ["sv Water Fairy"],

            args: [{
                    key: 'card',
                    prompt: 'what card do you want to look up?',
                    type: 'string'
                }]
        });
    }

    async run(message, args, client){
        const { card } = args;
        try {
            // Form query and send GET request
            const { body } = await request
                .get('https://shadowverse-portal.com/api/v1/cards')
                .query({format: 'json'})
                .query({lang: 'en'});
            
            // TODO: Fuzzy search instead of exact matching for easier results
            const cardList = body.data.cards;
            for (var i = 0; i < cardList.length; i++){
                if (cardList[i].card_name.toLowerCase() == card.toLowerCase()){
                    var cardInfo = cardList[i];
                    break;
                }
            }

            if (typeof cardInfo != 'undefined') {
                const embed = new RichEmbed()
                    .setColor(0x990099)
                    .setTitle('Shadowverse')
                    .setThumbnail(`https://shadowverse-portal.com/image/card/en/C_${cardInfo['card_id']}.png`)
                    .setURL('https://shadowverse.com')
                    .setTimestamp()
                    .addField('Stats',
                        `**Name:** ${cardInfo['card_name']}\
                            \n**Cost:** ${cardInfo['cost']} PP\
                            \n**Attack/Defense:** ${cardInfo['atk']}/${cardInfo['life']}\
                            \n**Evolved Attack/Defense:** ${cardInfo['evo_atk']}/${cardInfo['evo_life']}`, true)
                    .addField('Skills',
                        `**Skill:** ${cardInfo['skill_disc']}\
                            \n**Evolved Skill:** ${cardInfo['evo_skill_disc']}`, true)
                    .addField('Lore',
                        `**Description:** ${cardInfo['description']}\
                            \n**Evolved Description:** ${cardInfo['evo_description']}\
                            \n**Tribe:** ${cardInfo['tribe_name']}`, true)
                    .addField('Art',
                        `[Classic](https://shadowverse-portal.com/image/card/en/C_${cardInfo['card_id']}.png) - [Evolved](https://shadowverse-portal.com/image/card/en/E_${cardInfo['card_id']}.png)`, true);
                return message.embed(embed);
            } else {
                return message.say(`\`${card}\` did not match any cards.`);
            }
        } catch (err) {
            console.log(err);
            return message.say(`Something went wrong! Please try again later.`);
        }
    }
}