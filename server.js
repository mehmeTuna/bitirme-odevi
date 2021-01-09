//Express
const app = require("express")();

//SocketIO
const server = require("http").Server(app);
const io = require("socket.io")(server);
require("socket.io-stream")(io);

app.get("/", function (req, res) {
  res.send("asdasd");
});

server.listen(1453);

let podcastList = [];

io.on("connection", (socket) => {
  console.log("User Socket Connected");

  socket.emit("podcastList", podcastList);

  //eger yeni bir podcast baslarsa podcastListe ye ekle ve emit et
  socket.on("startPodcast", function (podcastName, podcastId, peerId) {
    const podcast = {
      podcastName: podcastName,
      id: podcastId,
      started: Date.now(),
      peers: [peerId],
      socketId: socket.id,
    };
    podcastList.push(podcast);
    socket.broadcast.emit("podcastList", podcastList);
  });

  //birileri podcaste katilirsa ilgili kanala ilet
  socket.on("joinPodcast", function (podcastId, peerId) {
    socket.join(socket.id);
    socket.to(podcastId).broadcast.emit("user-connected", peerId);

    socket.on("disconnect", () => {
      socket.to(podcastId).broadcast.emit("user-disconnected", peerId);
    });
  });

  socket.on("disconnect", () => {
    //yayini yapan kisi ayrilirsa yayin listesinden cikar
    podcastList = podcastList.filter((item) => item.socketId !== socket.id);
    socket.broadcast.emit("podcastList", podcastList);
    console.log(`${socket.id} User disconnected.`);
  });
});
