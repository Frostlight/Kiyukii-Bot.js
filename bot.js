const Commando = require('discord.js-commando');
const path = require('path');
const sqlite = require('sqlite');
const fs = require('fs');
// All credits for starboard system to: https://github.com/WeebDev/Commando
// This bot has a very simplified implementation of it
const Starboard = require('./structures/starboard');

var discordBotToken;
var discordCommandPrefix;

// Load Discord bot token and command prefix through config
if (process.env._ &&
    process.env._.indexOf("heroku")) {
    // Heroku environment
    if (process.env.DISCORD_BOT_TOKEN && process.env.DISCORD_COMMAND_PREFIX) {
        discordBotToken = process.env.DISCORD_BOT_TOKEN;
        discordCommandPrefix = process.env.DISCORD_COMMAND_PREFIX;
        console.log('-> Successfully loaded Heroku config variables');
    } else {
        console.log('ERROR: Heroku config vars DISCORD_BOT_TOKEN and/or DISCORD_COMMAND_PREFIX are not defined');
        process.exit();
    }
} else if (fs.existsSync('./config.json')) {
    // Standard environment
    const config = require('./config.json');
    if (config.discord_bot_token && config.discord_command_prefix) {
        discordBotToken = config.discord_bot_token;
        discordCommandPrefix = config.discord_command_prefix
        console.log('-> Successfully loaded config.json');
    } else {
        console.log('ERROR: config.json is invalid. discord_bot_token and/or discord_command_prefix are not defined');
        process.exit();
    }
} else {
    console.log('ERROR: config.json is missing. See config_example.json');
    process.exit();
}

// Initialise commando client
const client = new Commando.Client({
    owner: '116401285334433792',
    commandPrefix: discordCommandPrefix,
    unknownCommandResponse: false
});

// Client Events logging
client
    .on('error', console.error)
    .on('warn', console.warn)
    //.on('debug', console.log)
    .on('ready', () => {
        console.log(`-> Client ready! \n-> Logged in as ${client.user.username}#${client.user.discriminator} (${client.user.id})`)
        console.log(`-> Servers: ${client.guilds.array().length}`)
    })
    .on('disconnect', () => { console.warn('Disconnected!'); })
	.on('reconnecting', () => { console.warn('Reconnecting...'); })
    .on('commandError', (cmd, err) => {
        if(err instanceof Commando.FriendlyError) return;
        console.error('Error in command ${cmd.groupID}:${cmd.memberName}', err)
    })
    .on('message', () => {
        // Do nothing for now, but necessary to fire 'messageReactionAdd' events
    })
    // Initialize #starboard features
    .on('messageReactionAdd', (reaction, user) => {
        // Only star if the reaction is a :star:
        // Only star for the first count
		if (reaction.emoji.name !== '⭐' || reaction.count !== 1) {
            return;
        }
        
        // Star the message
		const { message } = reaction;
		const starboard = message.guild.channels.find('name', 'starboard');
		if (!starboard) {
            return message.channel.send(`${user}, can't star things without a #starboard.`); // eslint-disable-line consistent-return, max-len
        }
        Starboard.createStar(message, starboard, user);
	});
    
// Database
client.setProvider(
	sqlite.open(path.join(__dirname, 'database.sqlite3')).then(db => new Commando.SQLiteProvider(db))
    ).catch(console.error);

// Register command groups
client.registry
    // Registers custom command groups
    .registerGroups([
        ['general', 'General'],
        ['fun', 'Fun'],
        ['images', 'Images']
    ])
    // Registers all built-in groups, commands, and argument types
    .registerDefaults()
    // Registers all commands in the ./commands/ directory
    .registerCommandsIn(path.join(__dirname, 'commands'));
    
// Login to discord
client.login(discordBotToken);
    
