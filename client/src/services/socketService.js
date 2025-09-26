import { io } from "socket.io-client";

let socket = null;

export function initSocket() {
  if (socket) return socket;

  socket = io(import.meta.env.VITE_SERVER_URI || import.meta.env.VITE_SOCKET_URI, {
    path: "/socket.io",
    withCredentials: true,
    transports: ["websocket", "polling"],
    // autoConnect: true (default)
  });

  socket.on("connect_error", (err) => {
    console.error("Socket connect_error", err);
  });
  socket.on("connect", () => {
    console.info("Socket connected", socket.id);
  });

  return socket;
}

export function getSocket() {
  return socket;
}

export function closeSocket() {
  if (!socket) return;
  socket.disconnect();
  socket = null;
}
