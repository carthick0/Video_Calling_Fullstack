import React, { createContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SocketIOClient from "socket.io-client";

const WS_Server = "http://localhost:7000";

// eslint-disable-next-line @typescript-eslint/no-explicit-any, react-refresh/only-export-components
export const SocketContext = createContext<any | null>(null);

const socket = SocketIOClient(WS_Server,{
    withCredentials:false,
    transports:["polling","websockets"]
});

interface Props {
    children: React.ReactNode;
}

export const SocketProvider:React.FC<Props>=({ children })=> {
    const navigate=useNavigate()
    useEffect(()=>{

        const enterRoom=({roomId}:{roomId:string})=>{
            navigate(`/room/${roomId}`)
        }
        socket.on("room-created",enterRoom)
    },[])
  return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
