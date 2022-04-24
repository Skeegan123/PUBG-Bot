const { SlashCommandBuilder } = require('@discordjs/builders');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection } = require('@discordjs/voice');
const { token, clientId, guildId } = require('../config.json');
const { player } = require('./play.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unpause')
		.setDescription('Pauses the current song'),
	async execute(interaction) {

        const connection = getVoiceConnection(interaction.member.voice.channel.guildId);
		if (AudioPlayerStatus.Playing) {
            connection.state.subscription.player.unpause();
            await interaction.reply('Unpaused');
        } else {
            interaction.channel.send('No music to unpause');
        }
	},
};