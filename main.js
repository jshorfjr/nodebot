var net = require('net');

var BNCSPacket = require('./lib/bncspacket.js');
var BNCSPacketReader = require('./lib/bncspacketreader.js');
var BNCSPacketWriter = require('./lib/bncspacketwriter.js');

var client = net.createConnection(6112, "useast.battle.net", function() {
	console.log('Connected');
	var writer = new BNCSPacketWriter();
	writer.sendInitialPackets(client);
});

client.on('data', function(data) {
	var reader = new BNCSPacketReader(client, data);
});

client.on('error', function(err) {
	console.log('Error: ' + err);
	client.destroy(); // kill client after server's response
});

client.on('close',function(err) {
	console.log('Connection closed');
});