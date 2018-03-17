var Int64LE = require("int64-buffer").Int64LE;

var _arr = [];

var _packet;
var _packetId;
var _packetLength;

const intToUint8Array = function(int) {
	var arr = [];
	arr.push(int & 0xFF);
	return arr;
}

const intToUint16Array = function(int) {
	var arr = [];
	arr.push(int & 0x00FF);
	arr.push((int & 0xFF00) >> 8);
	return arr;
}

const intToUint32Array = function(int) {
	var arr = [];
	arr.push(int & 0x000000FF);
	arr.push((int & 0x0000FF00) >> 8);
	arr.push((int & 0x00FF0000) >> 16);
	arr.push((int & 0xFF000000) >> 24);
	return arr;
}

var BNLSPacket = function (packet) {
	_arr = [];

	if (packet.length == 1) {
		_packetId = packet;
	} else {
		_packetId = packet.readUInt8(1);
		_packetLength = packet.readUInt16LE(0);
		_packet = packet.slice(3, _packetLength);
	}
};

BNLSPacket.prototype.constructPacket = function () {
	var data = Buffer.concat(_arr);
	var header = []
	var pkt;

	header.push(new Buffer(intToUint16Array(data.length + 3), 'binary'));
	header.push(new Buffer(_packetId, 'binary'));
	
	pkt = header.concat(_arr);
	return Buffer.concat(pkt);
}

BNLSPacket.prototype.writeCustom = function (obj) {
	_arr.push(obj);
}

BNLSPacket.prototype.writeString = function (obj) {
	_arr.push(new Buffer(obj, 'binary'));
	_arr.push(new Buffer([0x00], 'binary'));
}

BNLSPacket.prototype.writeUint8 = function (obj) {
	_arr.push(new Buffer(intToUint8Array(obj), 'binary'));
}

BNLSPacket.prototype.writeUint32 = function (obj) {
	if (typeof obj === "string" && obj.length == 4) {
		_arr.push(new Buffer(obj, 'binary'))
	} else if (typeof obj === "number") {
		_arr.push(new Buffer(intToUint32Array(obj), 'binary'))
	}
}

BNLSPacket.prototype.writeUint64 = function (obj) {
	var int = new Int64LE(obj);
	_arr.push(int.toBuffer());
}


BNLSPacket.prototype.readToEnd = function () {
	var ret = _packet;
	_packet = null;
	return ret;
}

BNLSPacket.prototype.readUInt64 = function () {
	var ret = new Int64LE(_packet, 0)
	_packet = _packet.slice(8, _packet.length);
	return ret;
}

BNLSPacket.prototype.readUInt32 = function () {
	var ret = _packet.readUInt32LE(0);
	_packet = _packet.slice(4, _packet.length);
	return ret;
}

BNLSPacket.prototype.readUInt16 = function () {
	var ret = _packet.readUInt16LE(0);
	_packet = _packet.slice(2, _packet.length);
	return ret;
}

BNLSPacket.prototype.readUInt8 = function () {
	var ret = _packet.readUInt8(0);
	_packet = _packet.slice(1, _packet.length);
	return ret;
}

BNLSPacket.prototype.readString = function () {
	var endPos;
	var ret;
	for (var i = 0; i < _packetLength; i++) {
		if (_packet[i] == 0) {
			endPos = i;
			break;
		}
	}
	ret = _packet.toString("binary", 0, endPos);
	_packet = _packet.slice(endPos, _packetLength);
	return ret;
}

BNLSPacket.prototype.packetLength = function () {
	return _packetLength;
}

module.exports = BNLSPacket;