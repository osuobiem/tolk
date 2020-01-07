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

// Require in-app modules
const Socket = require("./lib/socket");

// Set app PORT
const PORT = process.env.PORT || 3000;

// Connect to socket
const io = new Socket(http);
io.connect();

// Load test index.html file for socket.io client
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

// Start application server
http.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
