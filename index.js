/**
 * index.js
 *
 * Entry file
 *
 * @package Tolk
 * @version 1.0.0
 * @author  Gabriel Osuobiem <osuobiem@gmail.com>
 * @link https://github.com/osuobiem
 * @link https://www.linkedin.com/in/osuobiem
 */

"use strict";

// Require and configure *dotenv* or environment variables
require("dotenv").config();

// Require useful modules
const app = require("express")();
const http = require("http").createServer(app);
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

// Require in-app modules
const Socket = require("./lib/socket");
const Logger = require("./lib/logger");
const router = require("./routes");
const messanger = require("./helpers/messanger");

app.use(bodyParser.json());
app.use(cookieParser("secret"));
app.use(router);

// Set app PORT
const PORT = process.env.PORT || 3000;

// Create logger instance
const log = new Logger();
log.console = true;

// Connect to socket
let io = new Socket(http);
io.connect(sock => {
  // Listen for group message
  sock.socket.on("group-message", res => {
    messanger.sendGroupMessage(sock, res);
  });

  // Check for socket disconnection
  sock.socket.on("disconnect", s => {
    io.disconnect(sock.socket);
  });
});

// Start application server
http.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
  new Logger(`Server is listening on port ${PORT}`);
});
