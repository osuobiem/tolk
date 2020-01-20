/**
 * ./models/user.model.js
 * Message Model
 * Message model instance
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

let Message = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  sender: {
    type: String,
    required: true
  },
  stamp: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model("User", User);
