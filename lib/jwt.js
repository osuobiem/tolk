/**
 * ./lib/jwt.js
 *
 * JWT Module
 * Handle JWT authentication.
 *
 * @package Tolk
 * @version 1.0.0
 * @author  Gabriel Osuobiem <osuobiem@gmail.com>
 * @link https://github.com/osuobiem
 * @link https://www.linkedin.com/in/osuobiem
 */

"use strict";

// Require useful modules
const jwt = require("jsonwebtoken");

// JWT secret key
const key = process.env.JWT_KEY;

module.exports = {
  /**
   * Issue a token
   *
   * @param {object} payload
   */
  issue(payload) {
    return jwt.sign(payload, key, {
      expiresIn: "5 minutes"
    });
  },

  /**
   * Verify supplied token
   *
   * @param {string} token
   * @param {function} callback
   */
  verify(token, callback) {
    return jwt.verify(token, key, {}, callback);
  }
};
