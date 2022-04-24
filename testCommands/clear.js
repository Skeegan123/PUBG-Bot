const { SlashCommandBuilder } = require('@discordjs/builders');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection } = require('@discordjs/voice');
const { token, clientId, guildId } = require('../config.json');
const { queue } = require('../commands/play.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clear')
		.setDescription('Clears the queue'),
	async execute(interaction) {
        const server_queue = queue.get(guildId);
        const connection = server_queue.connection;
        if (server_queue) {
		    queue.delete(guildId);
            interaction.channel.send("Cleared the queue!");
        } else {
            interaction.channel.send("There is nothing queued");
        }
	},
};