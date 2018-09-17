const net = require('net');

const client = new net.Socket();
client.connect(8080, '10.0.2.106', () => {
	console.log('Connected');
	client.write('Hello, server! Love, Client.');
});

client.on('data', data => {
	console.log('Received: ' + data);
	client.destroy(); // kill client after server's response
});

client.on('close', () => {
	console.log('Connection closed');
});