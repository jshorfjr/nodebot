var net = require('net');

const BNCSPacket = require('./bncspacket.js');
const BNCSPacketWriter = require('./bncspacketwriter.js');

var _packet;

const completeBNCSPacketInBuffer = function(buffer){
    if(buffer.length >= 4){
        if(buffer.readUInt8(0) == 255){
            if(buffer.readUInt16LE(2) <= buffer.length){
                return true
            }
        }
    }
    return false
}

const getBNCSPacketFromBuffer = function(buffer){
    var packet_length = buffer.readUInt16LE(2)
    //return Buffer.from(new Buffer(buffer, 0, packet_length ))
    const buff = Buffer.allocUnsafe(packet_length);
    //console.log(buff.length, '==', packet_length)
    buffer.copy(buff,0,0, packet_length)
    return buff
}

const removeBNCSPacketFromBuffer = function(buffer){
    var packet_len = buffer.readUInt16LE(2)
    return buffer.slice(packet_len)
}

var BNCSPacketReader = function (conn, data) {
    while(completeBNCSPacketInBuffer(data)) {
        var packet = getBNCSPacketFromBuffer(data);
        var packet_length = (packet.length - 4);
        console.log(data);
        data = removeBNCSPacketFromBuffer(data);

        var pid = packet.readUInt8(1)
        var writer = new BNCSPacketWriter();

        switch(pid) {
            case 0x0:
                console.log("s>c [0x00]");
                console.log(packet);
                writer.sendSID_NULL(conn);
                break;
            case 0x25:
                console.log("s>c [0x25]");
                console.log(packet);
                break;
            case 0x50:
                this.getSID_AUTH_INFO(packet);
                break;
            default:
                console.log(packet);
        }
    }
};

BNCSPacketReader.prototype.parseAuthInfo = function (data) {
    console.log("s>c [0x50]");
    console.log(data.length);
    var pkt = new BNCSPacket(data);

    console.log("packet len: %s", pkt.packetLength());

    console.log("logon type: %s", pkt.readUInt32());
    console.log("server token: %s", pkt.readUInt32());
    console.log("udp value: %s", pkt.readUInt32());
    console.log("mpq filetime: %s", pkt.readUInt64());
    console.log("mpq filename: %s", pkt.readString());
    console.log("valuestring: %s", pkt.readString());
}

module.exports = BNCSPacketReader;