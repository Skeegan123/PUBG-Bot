const { SlashCommandBuilder } = require('@discordjs/builders');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection } = require('@discordjs/voice');
const { token, clientId, guildId } = require('../config.json');
const { player } = require('./play.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('skip')
		.setDescription('Skips to the next song'),
	async execute(interaction) {

        const connection = getVoiceConnection(interaction.member.voice.channel.guildId);
		if (AudioPlayerStatus.Playing) {
            connection.state.subscription.player.stop();
            await interaction.reply('Skipped');
        } else {
            interaction.channel.send('No music to skip');
        }
	},
};