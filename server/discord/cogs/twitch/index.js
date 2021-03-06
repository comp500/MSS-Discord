const config = require('config');
const request = require('request');
const utils = require('./../../utils.js');
const twitch = require('twitch-get-stream')(config.get('api').twitch);

module.exports.info = {
	name: 'Twitch.tv Livestream',
	description: 'Play a Twitch.tv livestream using youtube-dl, which is prone to cutting out.',
	category: 'Music',
	aliases: [
		'twitch',
		'ttv'
	],
	use: [
		{
			name: '<username>',
			value: 'Play the audio of the Twitch streamer.'
		}
	]
};

module.exports.command = (message) => {
	if (!message.input) {
		message.channel.createMessage('No Twitch username provided');
	} else {
		const username = encodeURI(message.input.substring(message.content.lastIndexOf('/') + 1));

		if (!username) {
			message.channel.createMessage('Invalid Twitch username');
		} else {
			const query = {
				method: 'GET',
				json: true,
				uri: `https://api.twitch.tv/kraken/streams/${username}`,
				headers: {
					'User-Agent': config.get('useragent'),
					'Client-ID': config.get('api').twitch
				}
			};

			request(query, (err, res, body) => {
				if (body.error) {
					message.channel.createMessage('An error occured with the Twitch API server.');
				} else if (!body.stream) {
					message.channel.createMessage('The streamer is currently not live.');
				} else {
					twitch.get(username).then((streams) => {
						const audio = streams.find(stream => stream.quality === 'Audio Only');
						if (audio) {
							utils.music.add(message, {
								type: 'get',
								from: 'twitch.tv',
								media: audio.url,
								title: body.stream.channel.display_name,
								thumb: body.stream.preview.large,
								desc: body.stream.channel.status
							});
						} else {
							message.channel.createMessage('Could not find an adequate stream URL for this streamer.');
						}
					});
				}
			});
		}
	}
};
