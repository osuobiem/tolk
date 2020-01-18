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

/**
 * Exempt path/url from a specific middleware
 *
 * @param {string} path
 * @param {string} middleware
 */
function unless(path, middleware) {
  return function(req, res, next) {
    if (path === req.path) {
      return next();
    } else {
      return middleware(req, res, next);
    }
  };
}

// Logger middleware
function logIt(req, res, next) {
  log.info(
    req.connection.remoteAddress + " - " + req.method + " - " + req.path
  );
  next();
}

// Secure Route middleware
function secureRoute(req, res, next) {
  if (!req.headers.token) {
    res.redirect("/");
  }
  next();
}

// Add middlewares to router
router.use(logIt);
router.use(unless("/", secureRoute));

// Static files routes
router.get("/", (req, res) => {
  res.sendFile(__dirname + "/pages/index.html");
});

router.get("/join", (req, res) => {
  res.sendFile(__dirname + "/pages/join.html");
});

router.get("/group", (req, res) => {
  res.sendFile(__dirname + "/pages/group.html");
});

// API routes
router.post("/api/users/create", (req, res) => {
  user_con.create(req.body, resp => {
    res.json({ status: resp.status, message: resp.message });
  });
});

router.post("/api/users/login", (req, res) => {
  user_con.login(req.body, resp => {
    res.json({ status: resp.status, message: resp.message });
  });
});

module.exports = router;
