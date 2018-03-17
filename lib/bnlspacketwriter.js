var net = require('net');

const BNLSPacket = require('./bnlspacket.js');

var BNLSPacketWriter = function () {};

BNLSPacketWriter.prototype.requestVersionByte = function (conn) {
	var pkt = new BNLSPacket([0x10]);
	pkt.writeUint32(0x05);
	conn.write(pkt.constructPacket());
}

BNLSPacketWriter.prototype.sendVersionCheckEx = function (conn, productCode, mpqFiletime, mpqFilename, valueString) {
	var pkt = new BNLSPacket([0x1A]);
	console.log("[bnls c>s] 0x1A");
	pkt.writeUint32(productCode);
	pkt.writeUint32(0);
	pkt.writeUint32(0);
	pkt.writeUint64(mpqFiletime);
	pkt.writeString(mpqFilename);
	pkt.writeString(valueString);
	console.log(pkt.constructPacket());
	conn.write(pkt.constructPacket());
	pkt = null;
}

BNLSPacketWriter.prototype.sendCdKeyEx = function (conn, flags, serverToken, keys) {
	var pkt = new BNLSPacket([0x0C]);
	console.log("[bnls c>s] 0x0C");
	pkt.writeUint32(0);
	pkt.writeUint8([0x01]);
	pkt.writeUint32(flags);
	pkt.writeUint32(serverToken);
	pkt.writeString(keys[0]);
	console.log(pkt.constructPacket());
	conn.write(pkt.constructPacket());
	pkt = null;
}

module.exports = BNLSPacketWriter;