const express = require('express');
const tmi = require('tmi.js');
const fs = require('fs');
const path = require('path');

//Import your private constants
//E.g. Bot options
const opts = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'privateConst.json')))

//Web App codes
const app = express();
const port = 4000;

app.get('/', (req, res) => {
    res.sendFile('index.html', {root:__dirname});
});

app.listen(port, () => {
    console.log(`Now listening to port ${port}`);
});

//Twitch codes
const tmiClient = tmi.client(opts);

// Register handlers
tmiClient.on('message', onMessageHandler);
tmiClient.on('connected', onConnectedHandler);


// Connect to Twitch:
tmiClient.connect();

// Called every time a message comes in
function onMessageHandler (target, context, msg, self) {
    console.log(`onMessageHandler called`);
  if (self) { return; } // Ignore messages from the bot

  // Remove whitespace from chat message
  const commandName = msg.trim();

  // If the command is known, let's execute it
  if (commandName === '!dice') {
    const num = rollDice();
    tmiClient.say(target, `You rolled a ${num}`);
    console.log(`* Executed ${commandName} command`);
  } else {
    console.log(`* Unknown command ${commandName}`);
  }
}

// Function called when the "dice" command is issued
function rollDice () {
  const sides = 6;
  return Math.floor(Math.random() * sides) + 1;
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
  console.log(opts);
}

