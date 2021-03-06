const config = require('config');
const request = require('request');

const mention = /(\d+)/;

const url = 'http://www.think-maths.co.uk/spreadsheet';

module.exports.info = {
	name: 'Avatar Spreadsheet Generation',
	description: 'Generate a casual spreadsheet for yourself, or the mentioned user.',
	category: 'Fun',
	aliases: [
		'spreadsheets',
		'spreadsheet'
	],
	use: [
		{
			name: '',
			value: 'Generate a spreadsheet of your own avatar'
		}, {
			name: '<mention>',
			value: 'Generate a spreadsheet of the mentioned user'
		}
	]
};

module.exports.command = (message, client) => {
	let sender = null;

	const id = mention.exec(message.input);

	// Query for obtaining a form_build_id
	const query1 = {
		method: 'GET',
		url,
		headers: {
			'User-Agent': config.get('useragent')
		}
	};

	if (id && client.users.get(id[1]).staticAvatarURL) {
		sender = client.users.get(id[1]).staticAvatarURL;
	} else {
		sender = message.author.staticAvatarURL;
	}

	if (sender) {
		request(query1, (err1, res1, body1) => {
			if (err1 || res1.statusCode !== 200) {
				message.channel.createMessage('An error occured while retriving a `form_build_id`');
			} else {
				const regex = /name="form_build_id" value="(.+)"/g;
				const form = regex.exec(body1);

				// Query for uploading the Discord Avatar
				const query2 = {
					method: 'POST',
					url,
					encoding: null,
					headers: {
						'User-Agent': config.get('useragent'),
						Referer: url,
						'Content-Type': 'multipart/form-data'
					},
					formData: {
						'files[file]': {
							value: request(sender),
							options: {
								filename: 'avatar.jpg',
								contentType: 'image/jpeg'
							}
						},
						op: 'Download Excel',
						form_build_id: form[1],
						form_id: 'tm_mosaic_form'
					}
				};

				request(query2, (err2, res2, body2) => {
					if (err2 || res2.statusCode !== 200) {
						message.channel.createMessage('An error occured while retriving a `spreadsheet`');
					} else if (res2.headers['content-type'] !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
						message.channel.createMessage(`An error occured while retriving a \`spreadsheet\` instead of \`${res2.headers['content-type']}\``);
					} else {
						message.channel.createMessage('', {
							file: body2,
							name: 'spreadsheets.xlsx'
						});
					}
				});
			}
		});
	} else {
		message.channel.createMessage('Could not find user or avatar.');
	}
};
