const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
  },
});

let playerScores = [];

io.on("connection", (socket) => {
  socket.on("scores", (scores) => {
    playerScores.push(scores);
    console.log(playerScores);
    socket.emit("playerScores", playerScores);
  });

  socket.on("editScore", (response) => {
    console.log(response);
    let currentIndex = playerScores.findIndex(
      (score) => score.id === response.id
    );
    if (currentIndex !== -1) {
      playerScores[currentIndex] = {
        ...playerScores[currentIndex],
        ...response,
      };
    }
  });

  socket.on("deleteScore", (id) => {
    playerScores = playerScores.filter((score) => score.id !== id);
  });
  setInterval(() => {
    socket.emit("playerScores", playerScores);
  }, 1000);
});

httpServer.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
