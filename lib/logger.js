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
  path = "logs/";
  file = "app.log";
  console = false;

  /**
   * Check for existence of log file and
   * create it if it does not exist yet.
   */
  constructor() {
    fs.access(this.path + this.file, fs.F_OK, err => {
      if (err) this.initailize();
    });
  }

  /**
   * Generate logging date and time
   */
  time() {
    let d = new Date();

    let date = `${d.getFullYear()}/${this.format(
      d.getMonth() + 1
    )}/${this.format(d.getDate())}`;

    let time = `${this.format(d.getHours())}:${this.format(
      d.getMinutes()
    )}:${this.format(d.getSeconds())}`;

    return date + "  " + time;
  }

  /**
   * Format passed value and prepend '0'
   * if value length is less than 2
   *
   * @param {mixed} value
   */
  format(value) {
    value = value.toString();
    if (value.length < 2) {
      value = "0" + value;
    }

    return value;
  }

  /**
   * Create logs directory and create log file
   * in it.
   */
  initailize() {
    fs.mkdir(this.path, { recursive: true }, err => {
      if (err) {
        console.error(err);
      } else {
        let content = `::::::::: LOG FILE ::::::::::\n\nCreated: ${this.time()}\n\n`;

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
      default:
        style = `\n${this.time()}: [INFO] `;
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
}

module.exports = Logger;
