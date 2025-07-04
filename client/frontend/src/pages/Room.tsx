import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom"
import { SocketContext } from "../context/socket_context";

const Room=()=>{

    const {id}=useParams();
    const socket=useContext(SocketContext);
    useEffect(()=>{
        //emiting this event so that either createer of room or joinee in the room
        
        socket.emit("joined-room",{roomId:id})
    },[])
    return (
        <div>
            Room:{id}
        </div>
    )
}
export default Room