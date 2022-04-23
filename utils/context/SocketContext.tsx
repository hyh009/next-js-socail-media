import React, { useContext } from "react";
import {io, type Socket} from "socket.io-client";
import {type  ServerToClientEvents, ClientToServerEvents } from "../types/socket";
import baseUrl from "../baseUrl";

const socket:Socket<ServerToClientEvents, ClientToServerEvents> = io(baseUrl);
const SocketContext = React.createContext(socket);

export const useSocketConnect = ():Socket<ServerToClientEvents, ClientToServerEvents> => {
  return useContext(SocketContext);
};



export const SocketProvider: React.FC<React.ReactNode> = ({ children }) => {
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
