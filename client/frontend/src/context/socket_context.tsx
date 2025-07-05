/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import Peer from "peerjs";
import { v4 as UUIDv4 } from "uuid";
import { peerReducer } from "../reducers/peer_reducers";
import { addPeerAction } from "../actions/peer_action";

const WS_Server = "http://localhost:7000";

// 👇 Updated context type
interface ISocketContext {
  socket: Socket;
  user: Peer;
  stream?: MediaStream;
  peers: Record<string, { stream: MediaStream }>;
  toggleMute: () => void;
  isMuted: boolean;
}

export const SocketContext = createContext<ISocketContext | null>(null);

const socket = io(WS_Server, {
  withCredentials: false,
  transports: ["polling", "websockets"],
});

interface Props {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<Props> = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<Peer>();
  const [stream, setStream] = useState<MediaStream>();
  const [peers, dispatch] = useReducer(peerReducer, {});
  const [isMuted, setIsMuted] = useState(false); 

  const fetchUserFeed = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    setStream(stream);
  };

  const toggleMute = () => {
    if (!stream) return;
    const audioTrack = stream.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setIsMuted(!audioTrack.enabled);
    }
  };

  useEffect(() => {
    const userId = UUIDv4();
    const newPeer = new Peer(userId, {
      host: "localhost",
      port: 9000,
      path: "/myapp",
    });

    setUser(newPeer);
    fetchUserFeed();

    socket.on("room-created", ({ roomId }) => {
      navigate(`/room/${roomId}`);
    });

    return () => {
      socket.off("room-created");
    };
  }, [navigate]);

  useEffect(() => {
    if (!user || !stream) return;

    socket.on("user-joined", ({ peerId }) => {
      const call = user.call(peerId, stream);
      console.log("Calling the new peer:", peerId);

      call.on("stream", (remoteStream) => {
        dispatch(addPeerAction(peerId, remoteStream));
      });
    });

    user.on("call", (call) => {
      console.log("Receiving call from:", call.peer);
      call.answer(stream);

      call.on("stream", (remoteStream) => {
        dispatch(addPeerAction(call.peer, remoteStream));
      });
    });

    socket.emit("ready");

    return () => {
      socket.off("user-joined");
      user.off("call");
    };
  }, [user, stream]);

  if (!user) return null;

  return (
    <SocketContext.Provider
      value={{ socket, user, stream, peers, toggleMute, isMuted }}>
      {children}
    </SocketContext.Provider>
  );
};
