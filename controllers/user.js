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

// JWT secret key
const key = process.env.JWT_KEY;

class User {
  // Member variables
  user_data;

  /**
   * Create a new user - Insert user record in the db
   *
   * @param {object} user
   */
  create(user) {
    return new Promise((resolve, reject) => {
      bcrypt.hash(user.password, 10, (err, hash) => {
        if (err) {
          log.error(`BCryt Error: <<<< ${err} >>>>`);

          reject({
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

                reject({
                  status: false,
                  message: "Oops somethig went wrong. Try Again!"
                });
              }
              log.info("User created successfully");

              const token = jwt.issue({ _id: data._id }, key);

              this.user_data = {
                token,
                data: { _id: data._id, username: data.username }
              };

              resolve({ status: true, message: "User created successfully" });
            })
            .catch(err => {
              log.error(`An error occured <<<< ${err} >>>>`);

              reject({ status: false, message: err.message });
            });
        }
      });
    });
  }

  /**
   * Process user login
   *
   * @param {object} user
   * @param {function} callback
   */
  login(user) {
    return new Promise((resolve, reject) => {
      UserModel.findOne({
        username: user.username
      })
        .then(data => {
          if (!data || data.length === 0) {
            log.error(`Authentication Error: <<<< Invalid Credentials! >>>>`);
            reject({
              status: false,
              message: "Invalid Credentials!"
            });
          } else {
            this.comparePassword(user.password, data.password)
              .then(res => {
                const token = jwt.issue({ _id: data._id }, key);

                this.user_data = {
                  token,
                  data: { _id: data._id, username: data.username }
                };

                log.info("User logged in successfully");

                resolve(res);
              })
              .catch(err => {
                log.error(`Authentication Error: <<<< ${err} >>>>`);
                reject(err);
              });
          }
        })
        .catch(err => {
          log.error(`Authentication Error: <<<< ${err} >>>>`);
          reject({
            status: false,
            message: "Invalid Credentials!"
          });
        });
    });
  }

  /**
   * Verify user password
   *
   * @param {string} password
   * @param {string} encryptedPassword
   */
  comparePassword(password, encryptedPassword) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, encryptedPassword, (err, match) => {
        if (err) {
          log.error(`Authentication Error: <<<< ${err} >>>>`);
          reject({
            status: false,
            message: "Oops something went wrong. Try Again!"
          });
        }
        if (match) resolve({ status: true });
        else {
          log.error("Authentication Error: Invalid Credentials");
          reject({ status: false, message: "Invalid Credentials!" });
        }
      });
    });
  }
}

module.exports = User;
