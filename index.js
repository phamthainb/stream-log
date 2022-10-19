const express = require("express");
var cors = require("cors");
const path = require("path");
const tail = require("./utils/tail");
const app = express();
const port = 3300;

app.set("view engine", "hbs");
app.set("views", "./views");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(cors());

app.get("/", function (req, res) {
  return res.render("index", { listFiles });
});
const http = require("http").Server(app);

http.listen(port, () => {
  console.log(`Application running on: http://localhost:${port}`);
});
// socket
const io = require("socket.io")(http);

let fileSocket;
io.on("connection", (socket) => {
  //   console.log("socket::", socket);
  fileSocket = socket;
});

// config
var listFiles = process.argv.slice(-3);
var fileWatching = listFiles[0];
console.log(process.argv.slice(-3));

const tailer = tail(fileWatching, {
  buffer: 0,
});

tailer.on("line", (line) => {
  console.log("line::", fileWatching, Date.now(), line);
  if (fileSocket) fileSocket.emit("line", line);
});

app.post("/change-file", (req, res) => {
  try {
    console.log("req::", req.headers);
    fileWatching = req.body.fileName;
    console.log("fileWatching::", req.body.fileName, fileWatching);
    tailer.emit("change-file", fileWatching);
    return res.send(true);
  } catch (error) {
    console.log("error::", error);
    return res.status(500);
  }
});

app.get("/files", (req, res) => {
  return res.send(listFiles);
});
