import React, { useContext } from "react";
import io from "socket.io-client";
import baseUrl from "../baseUrl";

const socket = io(baseUrl);
const SocketContext = React.createContext(socket);

export const useSocketConnect = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
