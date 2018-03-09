var net = require('net');

var BNCSPacket = require('./bncspacket.js');
var BNCSPacketReader = require('./bncspacketreader.js');
var BNCSPacketWriter = require('./bncspacketwriter.js');

var BNCSClient = function () {
	var client = net.createConnection(6112, "useast.battle.net", function() {
		console.log("BNCS Connected");
		var writer = new BNCSPacketWriter();
		writer.sendInitialPackets(client);
	});

	client.on('data', function(data) {
		var reader = new BNCSPacketReader(client, data);
	});

	client.on('error', function(err) {
		console.log("BNCS Error: %s", err);
		client.destroy(); // kill client after server's response
	});

	client.on('close',function(err) {
		console.log("Connection closed");
	});
}

module.exports = BNCSClient;