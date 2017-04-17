const Commando = require('discord.js-commando');
const path = require('path');
const sqlite = require('sqlite');
const fs = require('fs');

// Initialise configuration file, create one if it doesn't exist
if (!fs.existsSync('./config.json')) {
    fs.writeFileSync('./config.json', '{"discord_bot_token" : "", "command_prefix" : "-"}');
    console.log('WARNING: config.json is missing.');
    process.exit();
};

const config = require('./config.json');

// Initialise commando client
const client = new Commando.Client({
    owner: '116401285334433792',
    commandPrefix: config.command_prefix
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
    });
    
// Database
client.setProvider(
	sqlite.open(path.join(__dirname, 'database.sqlite3')).then(db => new Commando.SQLiteProvider(db))
    ).catch(console.error);

// Register command groups
client.registry
    // Registers your custom command groups
    .registerGroups([
        ['general', 'General'],
        ['mobage', 'Mobage']
    ])

    // Registers all built-in groups, commands, and argument types
    .registerDefaults()

    // Registers all commands in the ./commands/ directory
    .registerCommandsIn(path.join(__dirname, 'commands'));
    
// Login to discord
client.login(config.discord_bot_token);
    