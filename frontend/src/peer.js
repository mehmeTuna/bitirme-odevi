import Peer from "peerjs";

const myPeer = new Peer(undefined, {
  host: "/",
  port: "3001",
});

export default myPeer;
