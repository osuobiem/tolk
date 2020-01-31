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
const Message = require("./controllers/message");

const user_con = new User();
const message_con = new Message();

// Initialize router object
const router = express.Router();

// Create logger instance
const log = new Logger();
log.console = true;

// Initialize Mongo instance and Connect to MongoDB
const mongo = new Mongo();
mongo.connect();

// JWT secret key
const key = process.env.JWT_KEY;

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
  return req.signedCookies ? req.signedCookies[name] : false;
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
    if (inArray(routesArr, req.path)) {
      res.redirect("/group");
    } else {
      if (user_con.user_data) {
        jwt.verify(token, err => {
          if (err) {
            let new_token = jwt.issue(
              { _id: user_con.user_data.data._id },
              key
            );

            res.cookie("token", new_token, {
              sameSite: true,
              httpOnly: true,
              signed: true
            });
          }
        });
      } else {
        res.clearCookie("token").redirect("/");
      }
    }
  } else {
    if (!inArray(routesArr, req.path)) {
      user_con.user_data = {};
      res.clearCookie("token").redirect("/");
    }
  }

  next();
}

// Add middlewares to router
router.use(logIt);
router.use(secure);

/* Static files routes */
// Login page
router.get("/", (req, res) => {
  res.sendFile(__dirname + "/pages/index.html");
});

// Join/Regitser page
router.get("/join", (req, res) => {
  res.sendFile(__dirname + "/pages/join.html");
});

// Group chat page
router.get("/group", (req, res) => {
  res.sendFile(__dirname + "/pages/group.html");
});

/* API routes */
// Create new user
router.post("/api/users/create", (req, res) => {
  user_con.create(req.body, resp => {
    let token = user_con.user_data ? user_con.user_data.token : false;
    let user = user_con.user_data ? user_con.user_data.data : false;

    res
      .cookie("token", token, {
        sameSite: true,
        httpOnly: true,
        signed: true
      })
      .json({ status: resp.status, message: resp.message, user });
  });
});

// User login
router.post("/api/users/login", (req, res) => {
  user_con
    .login(req.body)
    .then(resp => {
      console.log(resp);
      let token = user_con.user_data ? user_con.user_data.token : false;
      let user = user_con.user_data ? user_con.user_data.data : false;

      res
        .cookie("token", token, {
          sameSite: true,
          httpOnly: true,
          signed: true
        })
        .json({ status: resp.status, message: resp.message, user });
    })
    .catch(err => {
      res.json({ status: err.status, message: err.message });
    });
});

// User logout
router.post("/api/users/logout", (req, res) => {
  user_con.user_data = {};
  res.clearCookie("token").json({ status: true });
});

// Get group messages
router.get("/api/group/messages", (req, res) => {
  let data = message_con
    .groupMessages()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.send(err);
    });
});

module.exports = router;
