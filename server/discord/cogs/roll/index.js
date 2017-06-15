const regex = /(\d*)d?(\d*)/;

function randInt(d) {
	return Math.floor(Math.random() * d) + 1;
}

// The first alias is always the actual name of the command.
module.exports.alias = [
	'roll',
	'dice',
	'die',
	'random',
	'random roll',
	'random dice'
];

module.exports.command = function roll(message, client) {
	const parsed = regex.exec(message.input);
	const rolls = parseInt(parsed[1], 10) || 1;
	const sides = parseInt(parsed[2], 10) || 6;
	const result = [];
	let sum = 0;
	let output = '';

	if (rolls === 0) {
		output += 'Did not roll ';
	} else {
		output += 'Rolled ';
	}

	if (rolls === 1) {
		output += 'a ';
		if (sides === 0) {
			output += 'shape with no sides.';
		} else if (sides === 1) {
			output += 'mobius strip.';
		} else {
			output += `${sides}-sided dice.`;
		}
	} else {
		output += `${rolls} `;
		if (sides === 0) {
			output += 'die with no sides.';
		} else if (sides === 1) {
			output += 'mobius strips.';
		} else {
			output += `${sides}-sided die.`;
		}
	}

	if (sides < 0 && rolls < 0) {
		output += '\nHowever, such a theoretical shape could not be rolled for a negative number of times.';
		sum = 'Error';
		result.push('Error');
	} else if (sides < 0) {
		output += '\nHowever, such a theoretical shape could not be rolled.';
		sum = 'Error';
		result.push('Error');
	} else if (rolls < 0) {
		output += '\nHowever, such a shape cannot be rolled for a negative number of times.';
		sum = 'Error';
		result.push('Error');
	} else if (rolls > 50000) {
		output += '\nHowever, this was way too much to handle for this bot.';
		sum = 'Error';
		result.push('Error');
	} else if (rolls === 0 || sides === 0) {
		sum = 0;
		result.push(0);
	} else {
		for (let i = 0; i < rolls; i += 1) {
			const value = randInt(sides);
			sum += value;
			result.push(value);
		}
	}

	const embed = {
		embed: {
			description: output,
			fields: [
				{
					name: 'Total',
					value: sum.toString()
				}
			]
		}
	};

	if (result.join(' ').length < 500) {
		embed.embed.fields.push({ name: 'Die output', value: result.join(' ') });
		message.channel.createMessage(embed);
	} else {
		client.utils.gist(result.join(' '), (url) => {
			embed.embed.fields.push({ name: 'Die output', value: `[Full output](${url})` });
			message.channel.createMessage(embed);
		});
	}
};