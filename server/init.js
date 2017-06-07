var r = require("./db");
var config = require('config');

setTimeout(()=>{
	r.init(config.get('rethinkdb'), [
		{
			name: 'users',
			indexes: ['login']
		},
		{
			name: 'csrf',
			indexes: ['csrf']
		},
		{
			name: 'commands',
			indexes: ['']
		}
	]).then(function (conn) {
		r.conn = conn;
		r.connections.push(conn);
		r.conn.use(config.get('rethinkdb').db);
		console.log("Finished!");
		process.exit(1);
	});
}, 3000)
