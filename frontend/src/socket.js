import socketIOClient from "socket.io-client";

const ENDPOINT = "http://localhost:1453";

const socket = socketIOClient(ENDPOINT, {
  transports: ["websocket"],
  upgrade: false,
});

export default socket;
