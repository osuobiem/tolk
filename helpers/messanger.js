/**
 * ./helpers/messanger.js
 * Messager Helper
 * Assist with messaging operations.
 *
 * @package Tolk
 * @version 1.0.0
 * @author  Gabriel Osuobiem <osuobiem@gmail.com>
 * @link https://github.com/osuobiem
 * @link https://www.linkedin.com/in/osuobiem
 */

"use strict";

const messanger = {
  /**
   * Send group message
   *
   * @param {object} socket
   * @param {object} content
   */
  sendGroupMessage(socket, message) {
    let ip = socket.socket.handshake.address;

    message_con.save(message, res => {
      if (res.status) {
        let resp = {
          message: message.content,
          sender: message.user.username,
          stamp: res.data.stamp
        };
        socket.io.emit("group-message", resp);

        log.info(`${ip} sent a group message`);
      } else {
        log.error(`${ip} group message not sent`);
      }
    });
  }
};

module.exports = messanger;
