// server.js

const express = require('express');
const SocketServer = require('ws').Server;
const ws = require('ws');
const uuidv1 = require('uuid/v1');

// Set the port to 3001
const PORT = 3001;

// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const wss = new SocketServer({ server });
wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === ws.OPEN) {
      client.send(data);
    }
  });
};

function updateUserCount() { // Function enabling userCount and broadcasint
   const userCount = { type: "count", userCount:wss.clients.size};
   wss.broadcast(JSON.stringify(userCount));
}

wss.on('connection', (ws) => { // Once connected...
  console.log('Client connected');

    updateUserCount();

ws.on('message', (message) => { // Receives message from the App

    console.log('Got a message',message);
    const receivedMessage = JSON.parse(message);
  if(receivedMessage.type === "postMessage"){
    const newReceivedMessage = {
          type: "incomingMessage",
          id: uuidv1(),
          username: receivedMessage.username,
          content: receivedMessage.content
    }
    wss.broadcast(JSON.stringify(newReceivedMessage));
  } else if (receivedMessage.type === "postNotification"){
    console.log("CHANGED USERNAME")
    const newReceivedMessage = {
          type: "incomingNotification",
          id: uuidv1(),
          username: receivedMessage.username,
          content: receivedMessage.content
      }
  wss.broadcast(JSON.stringify(newReceivedMessage));
  }
});

 ws.on('close', () => {

    console.log('Client disconnected');
    updateUserCount();
  });

});
