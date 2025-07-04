import { Socket } from "socket.io";
import { v4 as UUIDv4 } from "uuid";

const roomHandler = (socket: Socket) => {
  const createRoom = () => {
    // This will be our unique room ID where multiple connections will exchange info
    const roomId = UUIDv4();

    // We will make the socket connection enter a new room
    socket.join(roomId);

    // Emit an event from the server side that the socket has been added to the room
    socket.emit("room-created", { roomId });

    console.log("Room created with ID", roomId);
  };

  const joinRoom = (roomId:String) => {
    console.log("New user has joined the room",roomId);
  };

  // We will call the above functions when the client emits events to create/join a room
  socket.on("create-room", createRoom);
  socket.on("joined-room", joinRoom);
};

export default roomHandler;
