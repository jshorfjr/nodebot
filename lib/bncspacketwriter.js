var net = require('net');

const BNCSPacket = require('./bncspacket.js');

var BNCSPacketWriter = function () {};

BNCSPacketWriter.prototype.sendInitialPackets = function (conn) {
	conn.write(new Buffer([0x01], 'binary'));
	this.sendAuthInfo(conn);
}

BNCSPacketWriter.prototype.sendAuthInfo = function (conn) {
	var pkt = new BNCSPacket([0x50]);
	pkt.writeUint32(0);
	pkt.writeUint32("68XI");
	pkt.writeUint32("VD2D");
	pkt.writeCustom(new Buffer([0x0E, 0x00, 0x00, 0x00], 'binary'))
	pkt.writeUint32("SUne");
	pkt.writeUint32(0);
	pkt.writeUint32(new Date().getTimezoneOffset());
	pkt.writeUint32(0x409);
	pkt.writeUint32(0x409);
	pkt.writeString("USA");
	pkt.writeString("United States");
	conn.write(pkt.constructPacket());
	console.log(pkt.constructPacket())
	pkt = null;
}

BNCSPacketWriter.prototype.sendNull = function (conn) {
	var pkt = new Buffer([0xFF, 0x00, 0x04, 0x00])
	console.log("[bncs c>s] 0x00");
	console.log(pkt);
	conn.write(pkt);
}

BNCSPacketWriter.prototype.sendPing = function (conn, pingValue) {
	var pkt = new BNCSPacket([0x25]);
	pkt.writeUint32(pingValue);
	conn.write(pkt.constructPacket());
	console.log("[bncs c>s] 0x25");
	console.log(pkt.constructPacket());
	pkt = null;
}

module.exports = BNCSPacketWriter;