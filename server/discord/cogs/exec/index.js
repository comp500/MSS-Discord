const exec = require('child_process').exec;
const config = require('config');
const utils = require('./../../utils.js');

module.exports.info = {
	name: 'Bash Execution',
	description: 'Execute bash commands.',
	category: 'Owner',
	aliases: [
		'exec'
	],
	use: [
		{
			name: '<command>',
			value: 'Execute the bash command.'
		}
	]
};

module.exports.command = (message) => {
	if (config.get('discord').admins.includes(message.author.id)) {
		if (!message.input) {
			message.channel.send('No input detected');
		} else {
			exec(message.input, (error, stdout, stderr) => {
				let output = '';

				if (stdout) {
					output += '=== stdout ===\n';
					output += `${stdout.replace(/`/g, '\'')}\n`;
				}

				if (stderr) {
					output += '=== stderr ===\n';
					output += `${stderr.replace(/`/g, '\'')}\n`;
				}

				if (output && output.length > 1900) {
					utils.gist(output, (url) => {
						message.channel.createMessage(url);
					});
				} else {
					message.channel.createMessage(`\nOutput\n\`\`\`\n${output}\`\`\``);
				}
			});
		}
	}
};
