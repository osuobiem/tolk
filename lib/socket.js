/**
 * socket.js
 *
 * Socket Class
 * This module works directly with socket.io
 * to handle connections, disconnections and
 * all operations that concerns sockets.
 *
 * @package Tolk
 * @version 1.0.0
 * @author  Gabriel Osuobiem <osuobiem@gmail.com>
 * @link https://github.com/osuobiem
 * @link https://www.linkedin.com/in/osuobiem
 */

"use strict";

class Socket {
  // Member variables
  io;
  socket;

  // Require socket.io module
  constructor(server) {
    this.io = require("socket.io")(server);
  }

  /**
   * Establish sockect connection
   */
  connect() {
    this.io.on("connection", socket => {
      this.socket = socket;
      console.log("New socket connection established.");
    });
  }

  /**
   * Close socket connection
   */
  disconnect() {
    this.io.on("disconnect", () => {
      console.log("Socket connection closed.");
    });
  }
}

module.exports = Socket;
