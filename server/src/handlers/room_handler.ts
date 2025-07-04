import { Socket } from "socket.io";
import { v4 as UUIDv4 } from "uuid";
import IRoomParams from "../interfaces/iroom_params";


  const rooms:Record<string,string[]>={};

const roomHandler = (socket: Socket) => {


  const createRoom = () => {
    // This will be our unique room ID where multiple connections will exchange info
    const roomId = UUIDv4();

    // We will make the socket connection enter a new room
    socket.join(roomId);

    rooms[roomId]=[]

    // Emit an event from the server side that the socket has been added to the room
    socket.emit("room-created", { roomId });

    console.log("Room created with ID", roomId);
  };
const joinRoom = ({ roomId, peerId }:IRoomParams) => {

  if(rooms[roomId]){
      console.log("New user has joined the room", roomId, "with peer id", peerId);
      rooms[roomId].push(peerId);
      socket.join(roomId)


      socket.emit("get-users",{
        roomId,
        participants:rooms[roomId]
      })
  }

};

  // We will call the above functions when the client emits events to create/join a room
  socket.on("create-room", createRoom);
  socket.on("joined-room", joinRoom);
};

export default roomHandler;
