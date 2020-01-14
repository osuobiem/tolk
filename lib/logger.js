/**
 * logger.js
 *
 * Logger Class
 * Log all application operations.
 *
 * @package Tolk
 * @version 1.0.0
 * @author  Gabriel Osuobiem <osuobiem@gmail.com>
 * @link https://github.com/osuobiem
 * @link https://www.linkedin.com/in/osuobiem
 */

"use strict";

// Require useful modules
const fs = require("fs");

class Logger {
  // Member variables
  path = "./logs/";
  file = "app.log";
  console = false;

  /**
   * Check for existence of log file and
   * create it if it does not exist yet.
   *
   * @param {string} content - optional log message
   */
  constructor(content = "") {
    fs.access(this.path + this.file, fs.F_OK, err => {
      if (err) this.initailize(content);
    });
  }

  /**
   * Create logs directory and create log file
   * in it.
   *
   * @param {string} message - optional log message
   */
  initailize(message = "") {
    fs.mkdir(this.path, { recursive: true }, err => {
      if (err) {
        console.error(err);
      } else {
        let content = `::::::::: LOG FILE ::::::::::\n\nCreated: ${time()}\n\n`;

        if (message) {
          content += `\n${time()}: [INFO] ${message}`;
        }

        fs.writeFile(this.path + this.file, content, err => {
          if (err) {
            console.error(err);
          }
        });
      }
    });
  }

  /**
   * Format initial log content according
   * to passed log type.
   *
   * @param {string} type
   */
  template(type) {
    let style = "";

    switch (type) {
      case "error":
        style = `\n${time()}: [ERROR] `;
        break;

      default:
        style = `\n${time()}: [INFO] `;
        break;
    }

    return style;
  }

  /**
   * Log an informative content
   *
   * @param {string} content
   */
  info(content) {
    content = this.template("info") + content;

    fs.appendFile(this.path + this.file, content, err => {
      if (err) console.error(err);
    });

    if (this.console) {
      console.log(content);
    }
  }

  /**
   * Log an erroneous content
   *
   * @param {string} content
   */
  error(content) {
    content = this.template("error") + content;

    fs.appendFile(this.path + this.file, content, err => {
      if (err) console.error(err);
    });

    if (this.console) {
      console.log(content);
    }
  }
}

/**
 * Generate logging date and time
 */
function time() {
  let d = new Date();

  let date = `${d.getFullYear()}/${format(d.getMonth() + 1)}/${format(
    d.getDate()
  )}`;

  let time = `${format(d.getHours())}:${format(d.getMinutes())}:${format(
    d.getSeconds()
  )}`;

  return date + "  " + time;
}

/**
 * Format passed value and prepend '0'
 * if value length is less than 2
 *
 * @param {mixed} value
 */
function format(value) {
  value = value.toString();
  if (value.length < 2) {
    value = "0" + value;
  }

  return value;
}

module.exports = Logger;
