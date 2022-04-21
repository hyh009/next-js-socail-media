import React, { useContext } from "react";
import { ServerToClientEvents, ClientToServerEvents } from "../types/socket";
import {io,Socket} from "socket.io-client";
import baseUrl from "../baseUrl";

const socket:Socket<ServerToClientEvents, ClientToServerEvents> = io(baseUrl);
const SocketContext = React.createContext(socket);

export const useSocketConnect = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
