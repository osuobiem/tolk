/**
 * ./models/user.model.js
 * Group Message Model
 * Group Message model instance
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
    _id: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true
    }
  },
  stamp: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Group Message", Message);
