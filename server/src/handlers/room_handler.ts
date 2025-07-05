import { Socket } from "socket.io";
import { v4 as UUIDv4 } from "uuid";
import IRoomParams from "../interfaces/iroom_params";

const rooms: Record<string, string[]> = {};

const roomHandler = (socket: Socket) => {

  const createRoom = () => {
    const roomId = UUIDv4();
    socket.join(roomId);
    rooms[roomId] = [];
    socket.emit("room-created", { roomId });
    console.log("Room created with ID", roomId);
  };

  const joinRoom = ({ roomId, peerId }: IRoomParams) => {
    if (rooms[roomId]) {
      console.log("New user has joined the room", roomId, "with peer id", peerId);
      rooms[roomId].push(peerId);
      socket.join(roomId);

      // Inform other users in the room
      socket.on("ready", () => {
        socket.to(roomId).emit("user-joined", { peerId });
      });

      // Send the list of current participants to the user who joined
      socket.emit("get-users", {
        participants: rooms[roomId],
        roomId,
      });
    }
  };

  // New Chat Message Event Handler
  socket.on("send-message", ({ roomId, message, sender }: { roomId: string; message: string; sender: string }) => {
    console.log(`Message from ${sender} in room ${roomId}: ${message}`);

    // Broadcast to everyone in the room except sender
    socket.to(roomId).emit("receive-message", { message, sender });
  });

  // Existing event listeners
  socket.on("create-room", createRoom);
  socket.on("joined-room", joinRoom);
};

export default roomHandler;
