var _arr = [];
var _packetId;

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

var BNCSPacket = function (packetId) {
	_packetId = packetId;
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

module.exports = BNCSPacket;