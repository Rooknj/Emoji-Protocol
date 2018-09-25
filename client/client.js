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
  if (data.toString().startsWith("::")) {
    message = "";
  }
  message += data.toString();
  if (data.toString().endsWith("::")) {
    const x = message.substring(2, message.length - 2);
    const response = JSON.parse(x);
    if (response["code"] === "ヽ(´▽`)/") {
      // Good request
      if (response["type"] === "emoji") {
        console.log(response["body"]);
      } else if (response["type"] === "meme") {
				console.log(response["body"].data);
				fs.writeFileSync("meme.jpg", Buffer.from(response["body"].data));
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
