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
    socket = io(socketURL, { withCredentials: true });

    socket.on("connect", () => {
      console.log("socket connected", socket.id);
      if (userId) socket.emit("join", String(userId));
    });
  }

  return socket;
};


export const getSocket = () => socket;
