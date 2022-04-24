// const ytdl = require('ytdl-core');
const { stream } = require('play-dl');
const ytSearch = require('yt-search');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection, getNextResource } = require('@discordjs/voice');
const { token, clientId, guildId } = require('../config.json');

const queue = new Map();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Joins and plays a video from youtube')
        .addStringOption(option =>
            option.setName('music')
                .setDescription('The music you would like to play')
                .setRequired(true)),

	async execute(interaction) {

        interaction.deferReply();

        const string = interaction.options.getString('music');

        const server_queue = queue.get(guildId);

        let song = {};

        const videoFinder = async (query) => {
            const videoResult = await ytSearch(query);

            return (videoResult.videos.length > 1) ? videoResult.videos[0] : null;
        }

        const video = await videoFinder(string);

        if (video) {
            song = { title: video.title, url: video.url}
        } else {
            interaction.channel.send('No video results found');
        }

        const channelId = interaction.member.voice.channelId;

        if (!server_queue) {
            const queueConstructor = {
                voiceChannel: channelId,
                textChannel: interaction.channel,
                connection: null,
                songs: []
            }

            queue.set(guildId, queueConstructor);
            queueConstructor.songs.push(song);

            try {
                const connection = joinVoiceChannel({
                    channelId: interaction.member.voice.channelId,
                    guildId: guildId,
                    adapterCreator: interaction.guild.voiceAdapterCreator,
                    selfDeaf: false,
                });

                queueConstructor.connection = connection;
                const player = createAudioPlayer();
                const subscription = connection.subscribe(player);

                videoPlayer(guildId, queueConstructor.songs[0]);

                player.on('error', error => {
                    interaction.channel.send('Sorry! There was an error! Please play the song again!');
                    console.error(error);
                });
                
            } catch (err) {
                queue.delete(guildId);
                interaction.channel.send("There was an error connecting!");
                throw err;
            }
        } else {
            server_queue.songs.push(song);
            return interaction.channel.send(`:thumbsup: ***${song.title}*** added to queue!`);
        }
	},
    
};

const videoPlayer = async (guild, song) => {
    const songQueue = queue.get(guild);

    const player = songQueue.connection.state.subscription.player;
    const connection = songQueue.connection;

    if (!song) {
        player.stop();
        connection.destroy();
        queue.delete(guild);
        return;
    }
    const playStream = await stream(song.url);
    const resource = createAudioResource(playStream.stream, { inputType: playStream.type });
    player.play(resource);
    player.on(AudioPlayerStatus.Idle, () => {
        songQueue.songs.shift();
        videoPlayer(guild, songQueue.songs[0]);
    });
    connection.on(VoiceConnectionStatus.Destroyed, () => {
        queue.delete(guild);
    });
    await songQueue.textChannel.send(`:notes: Now playing **${song.title}**`);
}