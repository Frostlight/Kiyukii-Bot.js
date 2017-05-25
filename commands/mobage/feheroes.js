const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const request = require('superagent');

module.exports = class FEHeroesCommand extends Command {
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

    async run(message, args, client){
        const { character } = args;
        
        try {
            // Response is plain text format (JSON data), so have to parse it
            const { text } = await request
                .get('https://raw.githubusercontent.com/ajhyndman/fire-emblem-working-title/master/packages/fire-emblem-heroes-stats/stats.json');
            const characterJSON = JSON.parse(text);
                
            // TODO: Fuzzy search instead of exact matching for easier results    
            const characterList = characterJSON.heroes;
            for (let i = 0; i < characterList.length; i++){
                if (characterList[i]['name'].toLowerCase() == character.toLowerCase()){
                    var characterInfo = characterList[i];
                    break;
                }
            }
            
            if (typeof characterInfo != 'undefined') {
                // Create string for stats of heroes
                var statString = 'HP/ATK/SPD/DEF/RES';
                // Level 1 4* stats (if it exists)
                if (typeof(characterInfo['stats']['1']['4']) != 'undefined') {
                    var statDir = characterInfo['stats']['1']['4'];
                    statString += `\n**4★ Neutral Level 1:**\n${statDir['hp']}/${statDir['atk']}/${statDir['spd']}/${statDir['def']}/${statDir['res']}`;
                }
                // Level 1 5* stats
                var statDir = characterInfo['stats']['1']['5'];
                statString += `\n**5★ Neutral Level 1:**\n${statDir['hp']}/${statDir['atk']}/${statDir['spd']}/${statDir['def']}/${statDir['res']}`;
                    
                // Level 40 5* stats
                if (typeof(characterInfo['stats']['40']['5']['hp'][2]) != 'undefined') {
                    var statDir = characterInfo['stats']['40']['5'];
                    // Stats have range, so we take the middle range
                    statString += `\n**5★ Neutral Level 40:**\n${statDir['hp'][1]}/${statDir['atk'][1]}/${statDir['spd'][1]}/${statDir['def'][1]}/${statDir['res'][1]}`;
                } else {
                    // Stats have no range, take the [0] index
                    var statDir = characterInfo['stats']['40']['5'];
                    statString += `\n**5★ Neutral Level 40:**\n${statDir['hp'][0]}/${statDir['atk'][0]}/${statDir['spd'][0]}/${statDir['def'][0]}/${statDir['res'][0]}`;
                }
                
                // Create string for skills of heroes
                var skillString = '';
                for (var i = 0; i < characterInfo['skills'].length; i++) {
                    // Add a comma before subsequent skills
                    if (i > 0) {
                        skillString += ", "
                    }
                    skillString += characterInfo['skills'][i]['name'];
                }
                
                const embed = new RichEmbed()
                    .setColor(0xCC0000)
                    .setTitle('Fire Emblem Heroes')
                    .setURL('https://fire-emblem-heroes.com/')
                    .setTimestamp()
                    .addField('Details',
                        `**Name:** ${characterInfo['name']}\
                            \n**Title:** ${characterInfo['title']}\
                            \n**Origin:** ${characterInfo['origin']}\
                            \n**Weapon Type:** ${characterInfo['weaponType']}\
                            \n**Rarity:** ${characterInfo['rarities']}\
                            \n**Release Date:** ${characterInfo['releaseDate']}`, true)
                    .addField('Stats', statString, true)
                    .addField('Skills', skillString, true)
                    .addField('Wiki',
                       `http://feheroes.wiki/${characterInfo['name']}`, true);
                return message.embed(embed);
            }
            else {
                return message.reply(`\`${character}\` did not match any characters.`)
            }    
        } catch (err) {
            console.log(err);
            return message.reply(`Something went wrong! Please try again later.`);
        }
    }
}
