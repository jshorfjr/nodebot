var net = require('net');

var BNCSPacket = require('./bncspacket.js');
var BNCSPacketReader = require('./bncspacketreader.js');
var BNCSPacketWriter = require('./bncspacketwriter.js');

var BNLSPacket = require('./bnlspacket.js');
var BNLSPacketReader = require('./bnlspacketreader.js');
var BNLSPacketWriter = require('./bnlspacketwriter.js');

var _cdkeys = [];

var _clientToken;
var _exeHash;
var _exeInfo;
var _exeVersion;
var _keyHash;
var _keyHashArr = [];
var _keyLength;
var _keyPublicValue;
var _keyProductValue;
var _logonType;
var _mpqFiletime;
var _mpqFilename;
var _pingValue;
var _productCode;
var _serverToken;
var _udpValue;
var _val1;
var _valueString;
var _versionByte;

const intToUint8Array = function(int) {
	var arr = [];
	arr.push(int & 0xFF);
	return arr;
}

var BNETClient = function () {
	_cdkeys.push("");

	console.log("[bncs] Conneting...");
	bncsClient = net.createConnection(6112, "useast.battle.net", function() {
		console.log("[bncs] Connected");
		var writer = new BNCSPacketWriter();
		writer.sendInitialPackets(bncsClient);
	});

	console.log("[bnls] Conneting...")
	var bnlsClient = net.createConnection(9367, "jbls.davnit.net", function() {
		console.log("[bnls] Connected");
		var writer = new BNLSPacketWriter();
		writer.requestVersionByte(bnlsClient);
	});

	bncsClient.on('data', function(data) {
		var bncsWriter = new BNCSPacketWriter();
		switch (data.readUInt8(1)) {
			case 0x00:
				console.log("[bncs s>c] 0x00");
				console.log(data);
				bncsWriter.sendNull(bncsClient);
				break;
			case 0x25:
				console.log("[bncs s>c] 0x25");
				console.log(data);

				var pkt = new BNCSPacket(data);

				_pingValue = pkt.readUInt32();

				console.log("pingvalue: %s", _pingValue);

				bncsWriter.sendPing(bncsClient, _pingValue);
				
				break;
			case 0x50:
				console.log("[bncs s>c] 0x50");
			    console.log(data);

			    var pkt = new BNCSPacket(data);

			    var packetLength = pkt.packetLength();
			    _logonType = pkt.readUInt32();
			    _serverToken = pkt.readUInt32();
			    _udpValue = pkt.readUInt32();
			    _mpqFiletime = pkt.readUInt64();
			    _mpqFilename = pkt.readString();
			    _valueString = pkt.readString();

			    pkt = null;

			    console.log("packet len: %s", packetLength);
			    console.log("logon type: %s", _logonType);
			    console.log("server token: %s", _serverToken);
			    console.log("udp value: %s", _udpValue);
			    console.log("mpq filetime: %s", _mpqFiletime);
			    console.log("mpq filename: %s", _mpqFilename);
			    console.log("valuestring: %s", _valueString);

			    var bnlsWriter = new BNLSPacketWriter();
			    bnlsWriter.sendVersionCheckEx(bnlsClient, _productCode, _mpqFiletime, _mpqFilename, _valueString);
				break;
			case 0x51:
				console.log("[bncs s>c] 0x51");
			    console.log(data);

			   	var pkt = new BNCSPacket(data);

			    var packetLength = pkt.packetLength();

			    var result = pkt.readUInt32();
			    switch (result) {
			    	case 0x000:
			    		console.log("test ok");
			    		break;
			    	case 0x100:
			    		console.log("0x100");
			    		break;
			    	default:
			    		console.log(result);
			    }
			    break;
			default:
				console.log(data);
		}
	});

	bncsClient.on('error', function(err) {
		console.log("[bncs] Error: %s", err);
		bncsClient.destroy();
	});

	bncsClient.on('close',function(err) {
		console.log("[bncs] Connection closed");
	});

	bnlsClient.on('data', function(data) {
		var bnlsWriter = new BNLSPacketWriter();
		switch (data.readUInt8(2)) {
			case 0x01:
				console.log("[bnls s>c] 0x01")
			case 0x0C:
				console.log("[bnls s>c] 0x0C")
				console.log(data);

				var pkt = new BNLSPacket(data);
				var cookie = pkt.readUInt32();
				var numKeysRequested = pkt.readUInt8();
				var numKeysEncrypted = pkt.readUInt8();
				var bitmask = pkt.readUInt32();
				_clientToken = pkt.readUInt32();
				_keyHash = pkt.readToEnd();


				console.log("client token: %s", _clientToken);
				//_keyHash = Buffer.concat(_keyHashArr);
				//_keyHash = Buffer.from(_keyHashArr);
				console.log("key hash: ");
				//console.log(_keyHashArr);
				console.log(_keyHash);
				pkt = null;
				var bncsWriter = new BNCSPacketWriter();
				bncsWriter.sendAuthCheck(bncsClient, _clientToken, _exeVersion, _exeHash, _keyHash, _exeInfo, "nodebot");
				break;
			case 0x1A:
				console.log("[bnls s>c] 0x1A")
				console.log(data);

				var pkt = new BNLSPacket(data);

				if (pkt.readUInt32() == 1) {
					_exeVersion = pkt.readUInt32();
					_exeHash = pkt.readUInt32();
					_exeInfo = pkt.readString();
					pkt = null;
				} else {
					console.log("[bnls s>c] 0x1A failed")
					pkt = null;
				}
				
				console.log("exeversion: %s", _exeVersion);
				console.log("exehash: %s", _exeHash);
				console.log("exeinfo: %s",_exeInfo);

				bnlsWriter.sendCdKeyEx(bnlsClient, 1, _serverToken, _cdkeys);
				break;
			case 0x10:
				console.log("[bnls s>c] 0x10")
				console.log(data);

				var pkt = new BNLSPacket(data);

			    _productCode = pkt.readUInt32();
			    _versionByte = pkt.readUInt32();

			    pkt = null;
				break;
			default:
				console.log("[bnls s>c] unknown");
				console.log(data);
		}
	});

	bnlsClient.on('error', function(err) {
		console.log("[bnls] Error: " + err);
		bnlsClient.destroy();
	});

	bnlsClient.on('close',function(err) {
		console.log("[bnls] Connection closed");
	});
}

module.exports = BNETClient;