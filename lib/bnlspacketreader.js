var net = require('net');

const BNLSClient = require('./bnlsclient.js');
const BNLSPacket = require('./bnlspacket.js');
const BNLSPacketWriter = require('./bnlspacketwriter.js');

var _packet;
var _productCode;
var _versionByte;

const completeBNLSPacketInBuffer = function(buffer){
    if(buffer.length >= 3){
        if(buffer.readUInt16LE(0) <= buffer.length){
            return true
        }
    }
    return false
}

const getBNLSPacketFromBuffer = function(buffer){
    var packet_length = buffer.readUInt16LE(0)
    //return Buffer.from(new Buffer(buffer, 0, packet_length ))
    const buff = Buffer.allocUnsafe(packet_length);
    //console.log(buff.length, '==', packet_length)
    buffer.copy(buff,0,0, packet_length)
    return buff
}

const removeBNLSPacketFromBuffer = function(buffer){
    var packet_len = buffer.readUInt16LE(0)
    return buffer.slice(packet_len)
}

var BNLSPacketReader = function (conn, data) {
    while(completeBNLSPacketInBuffer(data)) {
        var packet = getBNLSPacketFromBuffer(data);
        var packet_length = (packet.length - 3);

        data = removeBNLSPacketFromBuffer(data);

        var pid = packet.readUInt8(2)
        var writer = new BNLSPacketWriter();

        switch(pid) {
            case 0x10:
                console.log("s>c [0x10]");
                this.parseVersionByte(packet);
                break;
            default:
                console.log(packet);
        }
    }
};

BNLSPacketReader.prototype.parseVersionByte = function (data) {
    var pkt = new BNLSPacket(data);

    console.log(data);
    console.log("packet len: %s", pkt.packetLength());
    _productCode = pkt.readUInt32();
    _versionByte = pkt.readUInt32();
    //console.log("version byte: %s", pkt.readUInt32());
    return _versionByte;
}

/*
BNLSPacketReader.prototype.getProductCode() = function () {
    return _productCode;
}
*/
module.exports = BNLSPacketReader;
module.exports.VersionByte = _versionByte;