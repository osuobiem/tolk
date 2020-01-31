/**
 * ./helpers/crytex.js
 * Encryption Helper
 * Encrypt supplied data.
 *
 * @package Tolk
 * @version 1.0.0
 * @author  Gabriel Osuobiem <osuobiem@gmail.com>
 * @link https://github.com/osuobiem
 * @link https://www.linkedin.com/in/osuobiem
 */

"use strict";

// Require useful modules
const crypto = require("crypto");

// Specify encryption details
const algorithm = process.env.CRYPTO_ALGO;
const ckey = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

module.exports = {
  /**
   * Encrypt data
   *
   * @param {*, ! objects|arrays} text
   */
  encrypt(text) {
    let cipher = crypto.createCipheriv(algorithm, Buffer.from(ckey), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: iv.toString("hex"), encryptedData: encrypted.toString("hex") };
  },

  /**
   * Decrypt data
   *
   * @param {*, ! objects|arrays} text
   */
  decrypt(text) {
    let iv = Buffer.from(text.iv, "hex");
    let encryptedText = Buffer.from(text.encryptedData, "hex");
    let decipher = crypto.createDecipheriv(algorithm, Buffer.from(ckey), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  }
};
