import { useContext, useState } from "react";
import { SocketContext } from "../context/socket_context";
import { useNavigate } from "react-router-dom";

const CreateRoom = () => {
  const context = useContext(SocketContext);
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();

  const initRoom = () => {
    if (!context) return; // ensure context is available
    const { socket } = context;
    socket.emit("create-room");
  };

  const joinRoom=()=>{
    if(!roomId.trim()) return;
    navigate(`/room/${roomId.trim()}`)
  }
   return (
    <div className="flex flex-col gap-4 p-4 rounded-lg shadow-md bg-white w-[300px]">
      <button className="btn btn-secondary" onClick={initRoom}>
        ➕ Start a new meeting
      </button>

      <div className="flex flex-col gap-2">
        <input
          type="text"
          placeholder="Enter Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          className="input input-bordered"
        />
        <button
          onClick={joinRoom}
          className="btn btn-primary"
        >
          🔗 Join existing room
        </button>
      </div>
    </div>
  );
};

export default CreateRoom;