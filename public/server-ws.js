const port = 8080;
const WebSocket = require("ws");
const wss = new WebSocket.Server({ port });
const { uuidv4 } = require("uuidv4");
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
  clients.add({ ...ws, user_id: uuidv4() });
  // console.log(ws);
  log("info", "Client connected");
  ws.on("message", (data) => {
    const { rotation, position } = JSON.parse(data);
    console.log("position", { ...position }, "rotation", { ...rotation });

    clients.forEach((client) => {
      if (client === ws) return;
      client.send(
        JSON.stringify({ position, rotation, user_id: client.user_id }),
      );
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
