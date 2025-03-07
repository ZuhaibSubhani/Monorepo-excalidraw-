"use client";

import { useEffect, useState } from "react";
import { WS_URL } from "@/config";
import { Canvas } from "./Canvas";

export default function RoomCanvas({ roomId }: { roomId: string }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Fetch token once from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (!token) return; // Don't create a WebSocket connection without a valid token

    const ws = new WebSocket(`${WS_URL}?token=${token}`);

    ws.onopen = () => {
      setSocket(ws);
      ws.send(
        JSON.stringify({
          type: "join_room",
          roomId: Number(roomId),
        })
      );
    };

    ws.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };

    return () => {
      ws.close();
    };
  }, [token]); // Re-run when token is updated

  if (!socket) {
    return <div>Connecting...</div>;
  }

  return <Canvas roomId={roomId} socket={socket} />;
}
