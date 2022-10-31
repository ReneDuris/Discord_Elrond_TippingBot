import dotenv from 'dotenv'
dotenv.config()
import { Client, Events, GatewayIntentBits,Collection  } from 'discord.js';
import { REST, Routes } from 'discord.js';
import {readdirSync} from 'fs';
import path from 'path';

const {TOKEN_ID, GUILD_ID,CLIENT_ID} = process.env;
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();
const commanders = [];

const rest = new REST({
    version: '10'
}).setToken(TOKEN_ID);

const commandsPath = path.join('./commands');
const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {

	const filePath = path.join(commandsPath, file);
	const command = await import("./"+filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command.default && 'execute' in command.default) {
		client.commands.set(command.default.data.name, command.default);
        console.log(command.default.execute)
        commanders.push(command.default.data.toJSON());

        (async () => {
            try {
                console.log('Started refreshing application (/) commands.');
                
                await rest.put(
                    Routes.applicationGuildCommands(CLIENT_ID,GUILD_ID), {
                         body: commanders
                         
                    },
                );
        
                console.log('Successfully reloaded application (/) commands.');
            } catch (error) {
                console.error(error);
            }
        })();
        
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
	const command = interaction.client.commands.get(interaction.commandName);
	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}
	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});
client.login(TOKEN_ID);