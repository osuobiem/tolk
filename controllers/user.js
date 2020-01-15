/**
 * ./controllers/user.js
 *
 * User Controller
 * Perform all user related logic operartions
 *
 * @package Tolk
 * @version 1.0.0
 * @author  Gabriel Osuobiem <osuobiem@gmail.com>
 * @link https://github.com/osuobiem
 * @link https://www.linkedin.com/in/osuobiem
 */

"use strict";

// Require useful modules
const bcrypt = require("bcrypt");

// Require in-app modules
const UserModel = require("../models/user.model");
const Logger = require("../lib/logger");
const jwt = require("../lib/jwt");

// Create app logger instance
const log = new Logger();
log.console = true;

class User {
  // Member variables
  user_data;

  /**
   * Create a new user - Insert user record in the db
   *
   * @param {object} user
   */
  create(user, callback) {
    bcrypt.hash(user.password, 10, (err, hash) => {
      if (err) {
        log.error(`BCryt Error: <<<< ${err} >>>>`);

        callback({
          status: false,
          message: "Oops somethig went wrong. Try Again!"
        });
      } else {
        user.password = hash;

        let user_model = new UserModel(user);
        user_model
          .save()
          .then(data => {
            if (!data || data.length === 0) {
              log.error("Could not create user");

              callback({
                status: false,
                message: "Oops somethig went wrong. Try Again!"
              });
            }
            log.info("User created successfully");

            const token = jwt.issue({ _id: data._id });

            this.user_data = { token, data };

            callback({ status: true, message: "User created successfully" });
          })
          .catch(err => {
            log.error(`An error occured <<<< ${err} >>>>`);

            callback({ status: false, message: err.message });
          });
      }
    });
  }

  /**
   * Process user login
   *
   * @param {object} user
   */
  login(user) {
    UserModel.findOne({
      username: user.username
    })
      .then(data => {
        let pass_comp = this.comparePassword(user.password, data.password);

        if (pass_comp.status) {
          const token = jwt.issue({ _id: data._id });
          this.user_data = { token, data };

          log.info("User logged in successfully");
        } else {
          log.error(pass_comp.message);
        }

        return pass_comp;
      })
      .catch(err => {
        log.error(`An error occured <<<< ${err} >>>>`);
        return {
          status: false,
          message: "Oops something went wrong. Try Again!"
        };
      });
  }

  /**
   * Verify user password
   *
   * @param {string} password
   * @param {string} encryptedPassword
   */
  comparePassword(password, encryptedPassword) {
    bcrypt.compare(password, encryptedPassword, (err, match) => {
      if (err) {
        log.error(`Authentication Error: <<<< ${err} >>>>`);
        return {
          status: false,
          message: "Oops something went wrong. Try Again!"
        };
      }
      if (match) return { status: true };
      else {
        log.error("Authentication Error: Invalid Credentials");
        return { status: false, message: "Invalid Credentials!" };
      }
    });
  }
}

module.exports = User;
