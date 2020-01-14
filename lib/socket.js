/**
 * ./lib/socket.js
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
  connected = {};

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

      if (this.connected.hasOwnProperty(ip)) {
        this.connected[ip].count += 1;

        log.info(`${ip} opened a new browser tab`);
      } else {
        this.connected[ip] = { count: 1 };

        log.info(`${ip} socket connection established`);
      }

      callback({ socket, io: this.io });
    });
  }

  /**
   * Close socket connection
   */
  disconnect(socket) {
    let ip = socket.handshake.address;

    if (this.connected[ip].count === 1) {
      delete this.connected[ip];

      log.info(`${ip} socket connection closed`);
    } else {
      this.connected[ip].count -= 1;
      log.info(`${ip} closed a browser tab`);
    }
  }
}

module.exports = Socket;
