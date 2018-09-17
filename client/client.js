const net = require("net");

const client = new net.Socket();
client.connect(
  8080,
  "10.0.2.106",
  () => {
		console.log("Connected");
		let request = {
			type: "emoji",
			name: "cute bear"
		}
    client.write(JSON.stringify(request));
  }
);

client.on("data", data => {
	console.log("Received: " + data);
	const response = JSON.parse(data);
	if(response["code"] === "ヽ(´▽`)/") {
		// Good request
		console.log("Response body:", response["body"])
	} else {
		// Bad request
		console.log("Bad request");
	}
  client.destroy(); // kill client after server's response
});

client.on("close", () => {
  console.log("Connection closed");
});
