const port = 8080;
const WebSocket = require("ws");
const wss = new WebSocket.Server({ port });
const { uuid } = require("uuidv4");
// const clients = new Set();

let clients = [];

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
  ws.id = uuid();
  clients.push(ws);
  log("info", "Client connected");
  ws.on("message", (data) => {
    const { rotation, position } = JSON.parse(data);
    console.log("position", { ...position }, "rotation", { ...rotation });

    clients.forEach((client) => {
      let other_users = clients.filter((item) => item.id != ws.id);
      if (client === ws)
        return ws.send(
          JSON.stringify({
            current_user: ws.id,
            clients: other_users.map((item) => item.id),
          }),
        );
      client.send(
        JSON.stringify({
          position,
          rotation,
        }),
      );
    });
  });

  ws.on("close", () => {
    clients = clients.filter((item) => item.id != ws.id);
    log("info", "Client disconnected");
  });
});

wss.on("listening", () => {
  log("info", `websocket server started to ${port}`);
});
