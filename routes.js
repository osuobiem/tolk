/**
 * routes.js
 *
 * Router
 * Manage all application routes
 *
 * @package Tolk
 * @version 1.0.0
 * @author  Gabriel Osuobiem <osuobiem@gmail.com>
 * @link https://github.com/osuobiem
 * @link https://www.linkedin.com/in/osuobiem
 */

"use strict";

// Require useful modules
const express = require("express");

// Require in-app modules
const Logger = require("./lib/logger");

// Initialize router object
const router = express.Router();

// Create logger instance
const log = new Logger();
log.console = true;

// Static files routes
router.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
  log.info(
    req.connection.remoteAddress + " - " + req.method + " - " + req.path
  );
});

router.get("/group", (req, res) => {
  res.sendFile(__dirname + "/group.html");
  log.info(
    req.connection.remoteAddress + " - " + req.method + " - " + req.path
  );
});

module.exports = router;
