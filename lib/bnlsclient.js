var net = require('net');

var BNLSClient = function () {
	var client = net.createConnection(9367, "jbls.davnit.ne", function() {
		console.log("BNLS Connected");
	});

	client.on('data', function(data) {

	});

	client.on('error', function(err) {
		console.log('BNLS Error: ' + err);
		client.destroy(); // kill client after server's response
	});

	client.on('close',function(err) {
		console.log('BNLS Connection closed');
	});
};


module.exports = BNLSClient;