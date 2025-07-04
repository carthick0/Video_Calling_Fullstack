import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import Peer from "peerjs";
import { v4 as UUIDv4 } from "uuid";

// WebSocket server URL
const WS_Server = "http://localhost:7000";

// Define the context type
interface ISocketContext {
  socket: Socket;
  user: Peer;
  stream?: MediaStream 
}


// Create the context with default `null`
// eslint-disable-next-line react-refresh/only-export-components
export const SocketContext = createContext<ISocketContext | null>(null);

// Initialize the socket connection
const socket = io(WS_Server, {
  withCredentials: false,
  transports: ["polling", "websockets"],
});

// Props interface for children
interface Props {
  children: React.ReactNode;
}

// SocketProvider component
export const SocketProvider: React.FC<Props> = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<Peer>();

  const[stream,setStream]=useState<MediaStream>();
  

  const fetchUserFeed=async()=>{
    const stream=await navigator.mediaDevices.getUserMedia({
        video:true,
        audio:true
    })
    setStream(stream)
  }
  useEffect(() => {
    const userId = UUIDv4();
    const newPeer = new Peer(userId);

    setUser(newPeer);

    fetchUserFeed();
    // Listen for "room-created" event and navigate
    const enterRoom = ({ roomId }: { roomId: string }) => {
      navigate(`/room/${roomId}`);
    };

    socket.on("room-created", enterRoom);

   
  }, []);

  if (!user) return null; // Optionally show a loader until Peer is ready

  return (
    <SocketContext.Provider value={{ socket, user, stream }}>
      {children}
    </SocketContext.Provider>
  );
};
