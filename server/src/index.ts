import cors from "cors";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import { PORT } from "./config/server_config";
import roomHandler from "./handlers/room_handler";

const app = express();

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    methods: ["GET", "POST"],
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("new user connected");
  roomHandler(socket); // pass the socket connection to the roomhandler for room creation and joining room
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Server is up at ${PORT}`);
});
