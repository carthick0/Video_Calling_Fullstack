import { useContext } from "react";
import { SocketContext } from "../context/socket_context";

const CreateRoom=()=>{

    const socket=useContext(SocketContext);

    const initRoom=()=>{
        socket.emit("create-room")
    }
    return (
        <button 
                className="btn btn-secondary"
                onClick={initRoom}>
            Start a new meeting in a new room
        </button>
    )
}
export default CreateRoom;