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

var openConnections = [];

app.get('/', (req, res) => {
    res.sendFile('./webapp/index.html', { root: __dirname });
});
app.get('/webapp/index.js', (req, res) => {
    res.sendFile('./webapp/index.js', { root: __dirname });
});
app.get('/GetUser', (req, res) => {
    res.send("Bob");
});
app.get('/event', (req, res) => {
    req.socket.setTimeout(2147483647);

    // send headers for event-stream connection
    // see spec for more information
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });
    res.write('\n');

    openConnections.push(res);

    // When the request is closed, e.g. the browser window
    // is closed. We search through the open connections
    // array and remove this connection.
    req.on("close", function() {
        var toRemove;
        for (var j =0 ; j < openConnections.length ; j++) {
            if (openConnections[j] == res) {
                toRemove =j;
                break;
            }
        }
        openConnections.splice(j,1);
        console.log(openConnections.length);
    });
});

//Setting this up to ping the website every X min?
//To ensure event is always listening
setInterval(() => {
    var simpleJson = {
        twitch : "twtich",
        hello : "hello",
    };
    // we walk through each connection
    openConnections.forEach((res) => {
        var d = new Date();
        res.write('id: ' + d.getMilliseconds() + '\n');
        res.write('data:' + JSON.stringify(simpleJson) +   '\n\n'); // Note the extra newline
    });

}, 10000);

app.listen(port, () => {
    console.log(`Now listening to port ${port}`);
});

//Twitch codes
const tmiClient = tmi.client(opts);

// Register handlers
tmiClient.on('message', onMessageHandler);
tmiClient.on('connected', onConnectedHandler);


// Connect to Twitch
tmiClient.connect();

// Called every time a message comes in
function onMessageHandler(target, context, msg, self) {
    if (self) { return; } // Ignore messages from the bot

    // Remove whitespace from chat message
    const commandName = msg.trim();
    var commandNameSplit = commandName.split(' ');

    // If the command is known, let's execute it
    if (commandNameSplit[0] === '!dice' || commandNameSplit[0] === '!roll') {
        var numSides = 0
        if(commandNameSplit[1] !== undefined) {
            numSides = parseInt(commandNameSplit[1]);
            if(numSides === NaN) {
                numSides = 6;
            }
        }
        const num = rollDice(numSides);
        tmiClient.say(target, `You rolled a ${num}`);
        console.log(`* Executed ${commandName} command`);
    } else {
        console.log(`* Unknown command ${commandName}`);
    }
}

// Function called when the "dice" command is issued
function rollDice(sides = 6) {
    return Math.floor(Math.random() * sides) + 1;
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler(addr, port) {
    console.log(`* Connected to ${addr}:${port}`);
    console.log(opts);
}

