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

// Require in-app modules
const Logger = require("../lib/logger");

// Create app logger instance
const log = new Logger();
log.console = true;

class Socket {
  // Member variables
  io;

  /**
   * Require socket.io module
   *
   * @param {object} server - http server object
   */
  constructor(server) {
    this.io = require("socket.io")(server);
  }

  /**
   * Establish sockect connection
   *
   * @param {function} callback - Callback function that grants access to socket object
   */
  connect(callback) {
    this.io.on("connection", socket => {
      let ip = socket.handshake.address;

      log.info(`${ip} socket connection established`);

      callback({ socket, io: this.io });
    });
  }

  /**
   * Close socket connection
   */
  disconnect() {
    this.io.on("disconnect", () => {
      let ip = socket.handshake.address;

      log.info(`${ip} socket connection closed`);
    });
  }
}

module.exports = Socket;
