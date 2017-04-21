const Discord = require("discord.js");
const config = require("./../../config.json");
const os = require('os');

//Non-changing statistics
//  (x64) AMD Athlon (x3) Something @ 3ghz (clocked at ????MHz)
var hardwareinfo = "[CPU] (" + os.arch() + ") " + os.cpus()[0]["model"] + " (clocked at " + os.cpus()[0]["speed"] + "MHz)";
var softwareinfo = "[" + os.type() + "] " + os.release() + "\n[Hostname] " + os.hostname();

module.exports = function(message) {

	//Realtime statistics
	var pinginfo = message.client.ping.toFixed(2) + "ms";
	var guildcount = message.client.guilds.size;
	var shardcount = config.MSS.shards || false;
	var shardguildratio = (message.client.guilds.size / config.MSS.shards).toFixed(2) || false;
	var shardinfo = message.client.shard.id || false;

	var embed = new Discord.RichEmbed()
		.setFooter("MSS-Discord, " + config.MSS.version, "")
		.setTimestamp()
		.addField("MSS", config.MSS.version, true)
		.addField("Ping", pinginfo, true)
		.addField("Node.js", process.version, true)
		.addField("Uptime", process.uptime(), true)
		.addField("Guilds", guildcount, true)
		.addField("PID", process.pid, true)
		.addField("Hardware", hardwareinfo)
		.addField("Software", softwareinfo)
		.addField("Licence", "This software is released under the MIT Licence.");

	if(shardcount) {
		embed.addField("Shard", shardinfo, true)
			.addField("Shards", shardcount, true)
			.addField("Shard/Guild Ratio", shardguildratio, true);
	}

	message.channel.sendEmbed(embed, "", { disableEveryone: true });
}
