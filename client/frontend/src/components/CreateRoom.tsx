import { useContext } from "react";
import { SocketContext } from "../context/socket_context";

const CreateRoom = () => {
  const context = useContext(SocketContext);

  const initRoom = () => {
    if (!context) return; // ensure context is available
    const { socket } = context;
    socket.emit("create-room");
  };

  return (
    <button
      className="btn btn-secondary"
      onClick={initRoom}
    >
      Start a new meeting in a new room
    </button>
  );
};

export default CreateRoom;
