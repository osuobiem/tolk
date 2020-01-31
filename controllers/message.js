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
const GroupMessageModel = require("../models/group-message.model");
const Logger = require("../lib/logger");
const crypt = require("../helpers/cryptex");

// Create app logger instance
const log = new Logger();
log.console = true;

class Message {
  /**
   * Save group message in db
   *
   * @param {object} message
   * @param {function} callback
   */
  saveToGroup(message, callback) {
    let new_message = {
      content: message.content,
      sender: {
        _id: crypt.decrypt(message.user._id),
        username: message.user.username
      },
      stamp: Date.now()
    };

    let group_message_model = new GroupMessageModel(new_message);
    group_message_model
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

  /**
   * Get group messages
   */
  groupMessages() {
    return new Promise((resolve, reject) => {
      GroupMessageModel.find((err, data) => {
        if (err) {
          log.error(`Error fetching group messages: <<<< ${err} >>>>`);
          reject(false);
        }

        resolve(data);
      });
    });
  }
}

module.exports = Message;
