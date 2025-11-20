import { io } from "socket.io-client";

let socket;
export const connectSocket = (userId) => {
  if (!socket) {
    socket = io("http://localhost:5000", { withCredentials: true });

    socket.on("connect", () => {
      console.log("socket connected", socket.id);
      if (userId) socket.emit("join", String(userId));
    });
  }

  return socket;
};


export const getSocket = () => socket;
