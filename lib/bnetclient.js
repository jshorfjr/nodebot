var net = require('net');

var BNCSPacket = require('./bncspacket.js');
var BNCSPacketReader = require('./bncspacketreader.js');
var BNCSPacketWriter = require('./bncspacketwriter.js');

var BNLSPacket = require('./bnlspacket.js');
var BNLSPacketReader = require('./bnlspacketreader.js');
var BNLSPacketWriter = require('./bnlspacketwriter.js');

var BNETClient = function () {
	console.log("BNCS Conneting...");
	var bncsClient = net.createConnection(6112, "useast.battle.net", function() {
		console.log("BNCS Connected");
		var writer = new BNCSPacketWriter();
		writer.sendInitialPackets(bncsClient);
	});

	bncsClient.on('data', function(data) {
		//var reader = new BNCSPacketReader(bncsClient, data);
		switch (data.readUInt8(1)) {
			case 0x00:
				console.log("[BNCS s>c] 0x00");
				console.log(data);
				break;
			case 0x25:
				console.log("[BNCS s>c] 0x25");
				console.log(data);
				break;
			case 0x50:
				console.log("[BNCS s>c] 0x50");
				console.log(data);
				break;
			default:
				console.log(data);
		}
	});

	bncsClient.on('error', function(err) {
		console.log("BNCS Error: %s", err);
		bncsClient.destroy(); // kill client after server's response
	});

	bncsClient.on('close',function(err) {
		console.log("Connection closed");
	});

	console.log("BNLS Conneting...")
	var bnlsClient = net.createConnection(9367, "jbls.davnit.net", function() {
		console.log("BNLS Connected");
		var writer = new BNLSPacketWriter();
		writer.requestVersionByte(bnlsClient);
	});

	bnlsClient.on('data', function(data) {
		// reader = new BNLSPacketReader(bnlsClient, data);
		switch (data.readUInt8(2)) {
			case 0x10:
				console.log("[BNLS s>c] 0x10")
				console.log(data);
				break;
			default:
				console.log(data);
		}
	});

	bnlsClient.on('error', function(err) {
		console.log("BNLS Error: " + err);
		bnlsClient.destroy(); // kill client after server's response
	});

	bnlsClient.on('close',function(err) {
		console.log("BNLS Connection closed");
	});
}

module.exports = BNETClient;