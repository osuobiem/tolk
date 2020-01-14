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
const Mongo = require("./lib/mongo");

// Controllers
const User = require("./controllers/user");

const user_con = new User();

// Initialize router object
const router = express.Router();

// Create logger instance
const log = new Logger();
log.console = true;

// Initialize Mongo instance and Connect to MongoDB
const mongo = new Mongo();
mongo.connect();

// Logger middleware
function logIt(req, res, next) {
  log.info(
    req.connection.remoteAddress + " - " + req.method + " - " + req.path
  );
  next();
}

router.use(logIt);

// Static files routes
router.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

router.get("/group", (req, res) => {
  res.sendFile(__dirname + "/group.html");
});

// API routes
router.post("/users/create", (req, res) => {
  user_con.create(req.body, resp => {
    res.json({ status: resp.status, message: resp.message });
  });
});

module.exports = router;
