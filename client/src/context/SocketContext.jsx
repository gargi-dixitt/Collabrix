import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import socket from "../socket";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [connected, setConnected] = useState(false);
  const [reconnecting, setReconnecting] = useState(false);

  useEffect(() => {
    const userId = user?.id || user?._id;

    if (!userId) {
      socket.disconnect();
      setConnected(false);
      setReconnecting(false);
      return;
    }

    socket.io.opts.query = {
      ...(socket.io.opts.query || {}),
      userId,
    };

    const onConnect = () => {
      setConnected(true);
      setReconnecting(false);
    };

    const onDisconnect = (reason) => {
      setConnected(false);
      if (reason === "io server disconnect" || reason === "io client disconnect") {
        setReconnecting(false);
      } else {
        setReconnecting(true);
      }
    };

    const onReconnectAttempt = () => {
      setReconnecting(true);
    };

    const onReconnect = () => {
      setConnected(true);
      setReconnecting(false);
    };

    const onReconnectFailed = () => {
      setReconnecting(false);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.io.on("reconnect_attempt", onReconnectAttempt);
    socket.io.on("reconnect", onReconnect);
    socket.io.on("reconnect_failed", onReconnectFailed);

    if (!socket.connected) {
      socket.connect();
    } else {
      setConnected(true);
    }

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.io.off("reconnect_attempt", onReconnectAttempt);
      socket.io.off("reconnect", onReconnect);
      socket.io.off("reconnect_failed", onReconnectFailed);
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, connected, reconnecting }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
export default SocketContext;
