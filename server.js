const express = require("express");
const app = express();
const server = require("http").Server(app);
const next = require("next");
const cookieParser = require("cookie-parser");
const connectDb = require("./utilsServer/connectDb");
const dev = process.env.NODE_ENV !== "production";
const cors = require("cors");
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();
require("dotenv").config({ path: "./config.env" });
const PORT = process.env.PORT || 3000;

connectDb();

app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(cors());

nextApp.prepare().then(() => {
  app.use("/api/signup", require("./pages/api/signup"));
  app.use("/api/auth", require("./pages/api/auth"));
  app.use("/api/search", require("./pages/api/search"));
  app.use("/api/post", require("./pages/api/post"));

  app.all("*", (req, res) => handle(req, res));
  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`Express server running on ${PORT}`);
  });
});
