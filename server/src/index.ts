import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import ChatServer from "./chatserver";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
const chat = new ChatServer();

io.on("connection", (socket: Socket) => chat.init(socket));

server.listen(3001, () => {
  console.log(`Listening on port 3001`);
});
