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

// Require in-app modules
const UserModel = require("../models/user.model");
const Logger = require("../lib/logger");

// Create app logger instance
const log = new Logger();
log.console = true;

class User {
  // Member variables
  username;

  /**
   * Create a new user - Insert user record in the db
   *
   * @param {object} user
   */
  create(user) {
    let user_model = new UserModel(user);
    user_model
      .save()
      .then(doc => {
        if (!doc || doc.length === 0) {
          log.error("Could not create user");

          return false;
        }
        log.info("User created successfully");

        return true;
      })
      .catch(err => {
        log.error(`Could not create user <<<< ${err} >>>>`);

        return false;
      });
  }
}