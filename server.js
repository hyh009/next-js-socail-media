const express = require("express");
const app = express();
const { createServer } = require("http");
const { Server } = require("socket.io");
const httpServer = createServer(app);
const io = new Server(httpServer);
const next = require("next");
const cookieParser = require("cookie-parser");
const connectDb = require("./utilsServer/connectDb");
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();
require("dotenv").config({ path: "./config.env" });
const PORT = process.env.PORT || 3000;
// import socket event listener
require("./utilsServer/socketEventListener")(io);

connectDb();

app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

nextApp.prepare().then(() => {
  app.use("/api/signup", require("./api/signup"));
  app.use("/api/auth", require("./api/auth"));
  app.use("/api/search", require("./api/search"));
  app.use("/api/post", require("./api/post"));
  app.use("/api/profile", require("./api/profile"));
  app.use("/api/notification", require("./api/notification"));
  app.use("/api/chat", require("./api/chat"));

  app.all("*", (req, res) => handle(req, res));

  httpServer.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`Express server running on ${PORT}`);
  });
});
