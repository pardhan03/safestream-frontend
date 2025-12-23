import { io } from "socket.io-client";

let socket;

const getSocketURL = () => {
  if (window.location.hostname === "localhost") {
    return "http://localhost:5000";
  } else {
    return "https://safestream-backend.onrender.com"; 
  }
};

export const connectSocket = (userId) => {
  if (!socket) {
    const socketURL = getSocketURL();
    socket = io(socketURL, {
      // Render cold starts can take a while; default 20s often isn't enough.
      timeout: 60000,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      // Start with polling (more compatible), then upgrade to websocket.
      transports: ["polling", "websocket"],
    });

    socket.on("connect", () => {
      console.log("socket connected", socket.id);
      if (userId) socket.emit("join", String(userId));
    });

    socket.on("connect_error", (err) => {
      // This is where you'll see Render hibernation/cold start 503s.
      console.log("socket connect_error:", err?.message || err);
    });

    socket.on("reconnect", () => {
      // Ensure we re-join the room after reconnects.
      if (userId) socket.emit("join", String(userId));
    });
  }

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = undefined;
  }
};
