const Commando = require('discord.js-commando');
const request = require('request');

module.exports = class FEHeroesCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: "feheroes",
            group: "mobage",
            memberName: "feheroes",
            description: "Looks up Fire Emblem Heroes character information.",
            examples: ["feheroes Lucina"],

            args: [
                {
                    key: 'character',
                    label: 'character',
                    prompt: 'What character do you want to look up?',
                    type: 'string'
                }
            ]
        })
    }

    async run(msg, args, client){
        let character = args.character;

        request('https://raw.githubusercontent.com/ajhyndman/fire-emblem-working-title/master/packages/fire-emblem-heroes-stats/dist/stats.json', function(error, response, body) {
            if (!error && response.statusCode == 200) { 
                let characterList = JSON.parse(body)['heroes'];
                
                for (let i = 0; i < characterList.length; i++){
                    if (characterList[i]['name'].toLowerCase() == character.toLowerCase()){
                        var characterInfo = characterList[i];
                        break;
                    }
                }

                if (typeof characterInfo != 'undefined') {
                    return msg.reply("", {embed: {
                        color: 3447003,
                        title: `Fire Emblem Heroes`,
                        url: "https://fire-emblem-heroes.com/",
                        fields: [{
                            name: "Stats",
                            value: `**Name:** ${characterInfo['name']}\n**Title:** ${characterInfo['title']}
                                \n**4★ Neutral Level 1 HP/ATK/SPD/DEF/RES:** ${characterInfo[stats]['1']['4']}`,
                            inline: true
                        }]
                    }});
                }
                else {
                    return msg.reply(`\`${character}\` did not match any characters. Please try again.`)
                }
            }
        })
    }
}