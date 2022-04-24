const { SlashCommandBuilder } = require('@discordjs/builders');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection } = require('@discordjs/voice');
const { token, clientId, guildId } = require('../config.json');
const { queue } = require('../commands/play.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('queue')
		.setDescription('Shows the number of songs in the queue along with the first 10 songs'),
	async execute(interaction) {
        const server_queue = queue.get(guildId);
        const connection = server_queue.connection;
        if (server_queue) {
		    const songNum = server_queue.songs.length;
            let i = 0;
            interaction.channel.send(`There are ***${songNum}*** songs in the queue!`);
            do {

            } while (0);
        } else {
            interaction.channel.send("There is nothing queued");
        }
	},
};