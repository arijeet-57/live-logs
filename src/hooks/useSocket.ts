"use client";

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

export const useSocket = (postId?: string) => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Only connect on client-side
    const socket = io(); // Connects to the same host that served the page
    socketRef.current = socket;

    socket.on("connect", () => {
      setIsConnected(true);
      if (postId) {
        socket.emit("join-room", postId);
      }
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    return () => {
      socket.disconnect();
    };
  }, [postId]);

  const emitContentUpdate = (content: string) => {
    if (socketRef.current && postId) {
      socketRef.current.emit("content-update", { postId, content });
    }
  };

  const emitTyping = (author: string) => {
    if (socketRef.current && postId) {
      socketRef.current.emit("typing", { postId, author });
    }
  };

  return {
    socket: socketRef.current,
    isConnected,
    emitContentUpdate,
    emitTyping,
  };
};
