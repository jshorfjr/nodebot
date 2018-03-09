var Int64LE = require("int64-buffer").Int64LE;

var _arr = [];

var _packet;
var _packetId;
var _packetLength;

const intToUint16Array = function(int) {
	var arr = []
	arr.push(int & 0x00FF);
	arr.push((int & 0xFF00) >> 8);
	return arr;
}

const intToUint32Array = function(int) {
	var arr = []
	arr.push(int & 0x000000FF);
	arr.push((int & 0x0000FF00) >> 8);
	arr.push((int & 0x00FF0000) >> 16);
	arr.push((int & 0xFF000000) >> 24);
	return arr;
}

var BNCSPacket = function (packet) {
	_arr = [];

	if (packet.length == 1) {
		_packetId = packet;
	} else {
		_packetId = packet.readUInt8(1);
		_packetLength = packet.readUInt16LE(2);
		_packet = packet.slice(4, _packetLength);
	}
};

BNCSPacket.prototype.constructPacket = function () {
	var data = Buffer.concat(_arr);
	var header = []
	var pkt;

	header.push(new Buffer([0xFF]));
	header.push(new Buffer(_packetId, 'binary'));
	header.push(new Buffer(intToUint16Array(data.length + 4), 'binary'));
	
	pkt = header.concat(_arr);

	return Buffer.concat(pkt);
}

BNCSPacket.prototype.writeCustom = function (obj) {
	_arr.push(obj);
}

BNCSPacket.prototype.writeString = function (obj) {
	_arr.push(new Buffer(obj, 'binary'));
	_arr.push(new Buffer([0x00], 'binary'));
}

BNCSPacket.prototype.writeUint32 = function (obj) {
	if (typeof obj === "string" && obj.length == 4) {
		_arr.push(new Buffer(obj, 'binary'))
	} else if (typeof obj === "number") {
		_arr.push(new Buffer(intToUint32Array(obj), 'binary'))
	}
}

BNCSPacket.prototype.readUInt64 = function () {
	var ret = new Int64LE(_packet, 0)
	_packet = _packet.slice(8, _packet.length);
	return ret;
}

BNCSPacket.prototype.readUInt32 = function () {
	var ret = _packet.readUInt32LE(0);
	_packet = _packet.slice(4, _packet.length);
	return ret;
}

BNCSPacket.prototype.readUInt16 = function () {
	var ret = _packet.readUInt16LE(0);
	_packet = _packet.slice(2, _packet.length);
	return ret;
}

BNCSPacket.prototype.readUInt8 = function () {
	var ret = _packet.readUInt8(0);
	_packet = _packet.slice(1, _packet.length);
	return ret;
}

BNCSPacket.prototype.readString = function () {
	var endPos;
	var ret;
	for (var i = 0; i < _packetLength; i++) {
		if (_packet[i] == 0) {
			endPos = i;
			break;
		}
	}
	ret = _packet.toString("binary", 0, endPos);
	_packet = _packet.slice(endPos + 1, _packetLength);
	return ret;
}

BNCSPacket.prototype.packetLength = function () {
	return _packetLength;
}

BNCSPacket.prototype.sendInitialPackets = function (conn) {
	conn.write(new Buffer([0x01], 'binary'));
	this.sendSID_AUTH_INFO(conn);
}

BNCSPacket.prototype.sendAuthInfo = function (conn) {

}

module.exports = BNCSPacket;