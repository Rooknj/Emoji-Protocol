const net = require("net");

const message = "";

const client = new net.Socket();
client.connect(
  8080,
  "127.0.0.1",
  () => {
    console.log("Connected");
    // Request Emoji
    const emojiRequest = {
      type: "emoji",
      name: "cute bear"
    };
    client.write("::" + JSON.stringify(emojiRequest) + "::");

    // Request Meme
    const memeRequest = {
      type: "meme"
    };
    client.write("::" + JSON.stringify(memeRequest) + "::");
  }
);

client.on("data", data => {
	console.log("DATA")
	if(data.toString().startsWith("::")) {
		console.log("Starts");
		message="";
	}
	message += data.toString();
	if(data.toString.endsWith("::")) {
		console.log("ends");
		console.log(message.substring(2, message.length-2));
	}
  //console.log("Received: " + data);
  //const response = JSON.parse(data);
  // if(response["code"] === "ヽ(´▽`)/") {
  // 	// Good request
  // 	console.log("Response body:", response["body"])
  // } else {
  // 	// Bad request
  // 	console.log("Bad request");
  // }
  //client.destroy(); // kill client after server's response
});

client.on("close", () => {
  console.log("Connection closed");
});
