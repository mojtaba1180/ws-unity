const port = 8080;const WebSocket = require("ws");
const wss = new WebSocket.Server({ port });

const clients = new Set();

const log = (type, text) => {
  switch (type) {
    case "info":
      console.log(`[ INFO ]`, text);
      break;
    case "err":
      console.log("[ ERROR ]", text);
      break;
    default:
      console.log(`[ INFO ]`, text);
  }
};

wss.on("connection", (ws) => {
  clients.add(ws);
  log("info", "Client connected");
  ws.on("message", (data) => {
    const { x, y, z } = JSON.parse(data);
    log("info", `Received message with ( x:${x} y:${y} z:${z} ) `);

    clients.forEach((client) => {
      if (client === ws) return;
      client.send(JSON.stringify({ x, y, z }));
    });
  });

  ws.on("close", () => {
    clients.delete(ws);
    log("info", "Client disconnected");
  });
});

wss.on("listening", () => {
  log("info", `websocket server started to ${port}`);
});
