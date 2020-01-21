/**
 * ./controllers/user.js
 *
 * Message Controller
 * Perform all message related logic operartions
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
const MessageModel = require("../models/message.model");
const Logger = require("../lib/logger");

// Create app logger instance
const log = new Logger();
log.console = true;

class Message {
  save(message, callback) {
    let new_message = {
      content: message.content,
      sender: message.sender,
      stamp: Date.now()
    };

    let message_model = new MessageModel(new_message);
    message_model
      .save()
      .then(data => {
        if (!data || data.length === 0) {
          log.error("Message not saved");

          callback({
            status: false,
            message: "Oops something went wrong. try Again"
          });
        }

        log.info("Message Saved");

        callback({
          status: true,
          data
        });
      })
      .catch(err => {
        log.error(`Message not saved: <<<< ${err} >>>>`);

        callback({
          status: false,
          message: "Oops something went wrong. try Again"
        });
      });
  }
}

module.exports = Message;
