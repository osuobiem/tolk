/**
 * ./models/user.model.js
 *
 * User Model
 * User model instance
 *
 * @package Tolk
 * @version 1.0.0
 * @author  Gabriel Osuobiem <osuobiem@gmail.com>
 * @link https://github.com/osuobiem
 * @link https://www.linkedin.com/in/osuobiem
 */

"use strict";

// Require useful modules
const mongoose = require("mongoose");

let User = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  }
});

module.exports = mongoose.model("User", User);
