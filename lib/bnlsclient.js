var net = require('net');

var BNLSPacket = require('./bnlspacket.js');
var BNLSPacketReader = require('./bnlspacketreader.js');
var BNLSPacketWriter = require('./bnlspacketwriter.js');

var reader;

var BNLSClient = function () {
	var client = net.createConnection(9367, "jbls.davnit.net", function() {
		console.log("BNLS Connected");
		var writer = new BNLSPacketWriter();
		writer.requestVersionByte(client);
	});

	client.on('data', function(data) {
		reader = new BNLSPacketReader(client, data);
	});

	client.on('error', function(err) {
		console.log('BNLS Error: ' + err);
		client.destroy(); // kill client after server's response
	});

	client.on('close',function(err) {
		console.log('BNLS Connection closed');
	});
};

/*
BNLSPacket.prototype.getProductCode = function () {
	return reader.getProductCode();
}
*/
module.exports = BNLSClient;
module.exports.VersionByte = null;