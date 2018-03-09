var net = require('net');

const BNLSPacket = require('./bnlspacket.js');

var BNLSPacketWriter = function () {};

BNLSPacketWriter.prototype.requestVersionByte = function (conn) {
	var pkt = new BNLSPacket([0x10]);
	pkt.writeUint32(0x05);
	console.log("BNLS c>s [0x10]");
	console.log(pkt.constructPacket());
	conn.write(pkt.constructPacket());
}

module.exports = BNLSPacketWriter;