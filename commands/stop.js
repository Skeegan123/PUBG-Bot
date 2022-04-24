const { SlashCommandBuilder } = require('@discordjs/builders');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection } = require('@discordjs/voice');
const { token, clientId, guildId } = require('../config.json');
const { queue } = require('./play.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stop')
		.setDescription('Stops the current song'),
	async execute(interaction) {

        const connection = getVoiceConnection(interaction.member.voice.channel.guildId);
		if (AudioPlayerStatus.Playing) {
            connection.state.subscription.player.stop();
            connection.destroy();
            await interaction.reply('Stopped');
        } else {
            interaction.channel.send('No music to stop');
        }
	},
};