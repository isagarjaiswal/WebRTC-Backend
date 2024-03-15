const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { roomHandler } = require("./room/index");

const app = express();

app.use(cors());
const port = 8080;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("User connected.");
  roomHandler(socket);
  socket.on("disconnect", () => {
    console.log("User disconnected.");
  });
});

server.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
