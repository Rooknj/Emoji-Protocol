const net = require("net");
const fs = require("fs");

let message = "";

const client = new net.Socket();
client.connect(
  8080,
  "127.0.0.1",
  () => {
    console.log("Connected");
    if (process.argv[2] === "meme") {
      // Request Meme
      const memeRequest = {
        type: "meme"
      };
      client.write("::" + JSON.stringify(memeRequest) + "::");
    } else {
      // Request Emoji
      const emojiRequest = {
        type: "emoji",
        name: process.argv[2]
      };
      client.write("::" + JSON.stringify(emojiRequest) + "::");
    }
  }
);

client.on("data", data => {
	// Check for the start of the message
  if (data.toString().startsWith("::")) {
    message = "";
	}
	
	// Add the received packet data to the message buffer
	message += data.toString();
	
	// Check for the end of the message
  if (data.toString().endsWith("::")) {
		// Get rid of the ::'s from the message
		const x = message.substring(2, message.length - 2);
		// Parse the message
		const response = JSON.parse(x);
		
		// Do stuff with the response
    if (response["code"] === "ヽ(´▽`)/") {
      // Good request
      if (response["type"] === "emoji") {
        console.log(response["body"]);
      } else if (response["type"] === "meme") {
				const filetype = response["filetype"];
				fs.writeFileSync("meme." + filetype, Buffer.from(response["body"].data));
				console.log("Saved meme as meme." + filetype);
      }
    } else {
      // Bad request
      console.log("Bad request");
    }
  }
  //console.log("Received: " + data);

  //client.destroy(); // kill client after server's response
});

client.on("close", () => {
  console.log("Connection closed");
});
