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
const jwt = require("./lib/jwt");

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
 * Check if an element exists in an array
 *
 * @param {array} haystack
 * @param {*} needle
 */
function inArray(haystack, needle) {
  let res = false;

  [...haystack].forEach(element => {
    if (element === needle) {
      res = true;
    }
  });

  return res;
}

// Routes excempted from authentication
let routesArr = ["/", "/api/users/login", "/join", "/api/users/create"];

/**
 * Get cookie from request object
 *
 * @param {object} req
 * @param {string} name
 */
function getCookie(req, name) {
  let cook = false;
  if (req.headers.cookie) {
    let cookies = req.headers.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i].trim();

      if (cookie.indexOf(name) == 0) {
        cook = cookie.substring(name.length + 1, cookie.length).toString();
      }
    }
  }

  return cook;
}

// Logger middleware
function logIt(req, res, next) {
  log.info(
    req.connection.remoteAddress + " - " + req.method + " - " + req.path
  );
  next();
}

// Secure routes middleware
function secure(req, res, next) {
  let token = getCookie(req, "token");

  if (token) {
    jwt.verify(token, err => {
      if (err) {
        routesArr.push("/api/users/logout");
      }
    });
  }

  if (inArray(routesArr, req.path)) {
    if (token) {
      jwt.verify(token, err => {
        if (!err) {
          res.redirect("/group");
        }
      });
    }
    next();
  } else {
    if (token) {
      jwt.verify(token, err => {
        if (err) {
          log.error(`Authentication error: <<<< ${err} >>>>`);

          res.redirect("/");
        }
        next();
      });
    } else {
      res.redirect("/");
    }
  }
}

// Add middlewares to router
router.use(logIt);
router.use(secure);

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
    let token = user_con.user_data ? user_con.user_data.token : false;
    let user = user_con.user_data ? user_con.user_data.data.username : false;
    res.json({ status: resp.status, message: resp.message, token, user });
  });
});

router.post("/api/users/logout", (req, res) => {
  user_con.user_data = {};
  res.json({ status: true });
});

module.exports = router;
