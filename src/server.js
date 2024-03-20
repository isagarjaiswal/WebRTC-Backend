import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { roomHandler } from "./room/index.js";

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
  console.log("User is connected");
  roomHandler(socket);
  socket.on("disconnect", () => {
    console.log("User is disconnected");
  });
});

server.listen(port, () => {
  console.log(`listening port on :${port}`);
});
