const { WebSocketServer } = require("ws");const app = require("express");
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const { uuid } = require("uuidv4");
// Spinning the http server and the WebSocket server.
// const wsServer = new WebSocketServer({ server });
const port = 8000;

// const clients = new Set();

// // A new client connection request received
// wsServer.on("connection", function (ws) {
//   // Generate a unique code for every user
//   console.log(`Recieved a new connection.`);
//   // Store the new connection and handle messages
//   clients.add(ws);

//   ws.on("message", (data) => {
//     // const message = JSON.parse(data);
//   });

//   ws.on("close", () => {
//     clients.delete(ws);
//     console.log("client disconnected!");
//   });

//   const location = { x: Math.random(), y: Math.random(), z: Math.random() };
//   setInterval(() => {
//     ws.send(JSON.stringify(location));
//   }, 1000);
// });

io.on("connection", (socket) => {
  console.log("connected");
  socket.emit("event", {
    x: Math.random(),
    y: Math.random(),
    z: Math.random(),
  });
});

http.listen(port, () => {
  console.log(`WebSocket server is running on port ${port}`);
});
