import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    // In local dev, connect directly to port 5000; in production use configured URL or same origin
    const socketUrl = import.meta.env.VITE_SOCKET_URL && import.meta.env.VITE_SOCKET_URL !== '/'
      ? import.meta.env.VITE_SOCKET_URL
      : (window.location.hostname === 'localhost' ? 'http://localhost:5000' : window.location.origin);

    const newSocket = io(socketUrl, {
      autoConnect: true,
      transports: ['polling', 'websocket'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    newSocket.on('connect', () => {
      console.log('⚡ Socket connected to server:', newSocket.id);
    });

    newSocket.on('connect_error', (err) => {
      console.warn('Socket connection retry...', err.message);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user?.id]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  return context?.socket || null;
};
