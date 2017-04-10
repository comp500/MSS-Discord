//Get the required shit together
const config = require("./config.json");
const API = require("./api.json");
const Discord = require("discord.js");
const client = new Discord.Client();
const MSS = require("./functions/");
const fs = require("fs");
var command = [];
var reaction = [];

//Login to Discord
client.login(API.discord);

//Include all files in the commands directory for commands
fs.readdir("./commands/", function(err, items) {
	items.forEach(function(item) {
		var file = item.replace(/['"]+/g, "");
		console.log(file);
		command[file] = require("./commands/" + file + "/");
	});
});

//Include all files in the commands directory for reactions
fs.readdir("./reactions/", function(err, items) {
	items.forEach(function(item) {
		var file = item.replace(/['"]+/g, "");
		if (file.endsWith(".js")) {
			file = file.replace(".js", "").toLowerCase();
			console.log(file);
			reaction[file] = require("./reactions/" + file);
		}
	});
	//List all avalible reactions
	//console.dir(reaction);
});



client.on("ready", function() {
	console.log("Successfully connected to Discord!");
	client.user.setGame(config.MSS.prefix + "man | " + config.MSS.version);
});

client.on("message", function(message) {

	//Split message into keywords
	let input = message.content.replace(/\n/g, "").split(" ");

	//Disallow if the author is a bot
	if (message.author.bot) return;

	//Remove the first term if it contains the bot ID
	if (input[0].indexOf(client.user.id) != -1 && input[1]) {
		input.shift();
		//Rebuild the new message to fit the legacy format.
		message.content = input.join(" ");
	}

	//If there's a prefix, remove it. Otherwise, stop the execution of commands.
	if (input[0].startsWith(config.MSS.prefix)) {
		input[0] = input[0].substring(config.MSS.prefix.length).toLowerCase();
	} else {
		return false;
	}

	//If the command exists, run the command
	if (command[input[0]]) {
		command[input[0]](message);
	}
});

client.on("messageReactionAdd", function(messageReaction, user) {
	//Not on other's messages
	if(!(messageReaction.message.author.id === client.user.id)) return;
	//Not if the author is a bot
	if (user.bot) return;

	//Get decimal codepoint of emoji
	var input = messageReaction.emoji.name.codePointAt().toString();

	console.log(input);

	if (reaction[input]) {
		reaction[input](messageReaction, user);
	}
});

process.on("unhandledRejection", function(err) {
  console.error("Uncaught Promise Error: \n" + err.stack);
});
