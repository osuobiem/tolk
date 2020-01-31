/**
 * ./lib/mongo.js
 *
 * Mongo Class
 * Carry out all MongoDB operations
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
const mongoose = require("mongoose");

// Require in-app modules
const Logger = require("./logger");

// Create app logger instance
const log = new Logger();
log.console = true;

class Mongo {
  // Member variables
  url;
  db;

  /**
   * Initialize mongodb credentials
   */
  constructor() {
    const server = process.env.DB_SERVER;
    this.db = process.env.DB_NAME;
    const username = process.env.DB_USERNAME;
    const password = process.env.DB_PASSWORD;

    this.url = encodeURI(
      `mongodb://${username}:${password}@${server}/${this.db}`
    );
  }

  /**
   * Open a connection to specified database on instance of MongoDB
   */
  connect() {
    mongoose.connect(this.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    let connection = mongoose.connection;

    connection.on("error", err => {
      log.error(`MongoDB connection failed: <<<< ${err} >>>>`);
    });
    connection.once("open", () => {
      log.info(
        `MongoDB connection established. Connected to ${this.db} database`
      );
    });
  }
}

module.exports = Mongo;
