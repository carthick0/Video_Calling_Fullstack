import React, { createContext } from "react";
import SocketIOClient from "socket.io-client";

const WS_Server = "http://localhost:7000";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SocketContext = createContext<any | null>(null);

const socket = SocketIOClient(WS_Server);

interface Props {
    children: React.ReactNode;
}

export function SocketProvider({ children }: Props) {
  return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
