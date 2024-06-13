/**
 * Evidence Database
 *
 * @author Jesse Kaufman <jesse@jessekaufman.com>
 */
import config from "./config/config.js";
import app from "./app.js";
config.setup();

/**
 * @typedef {Object} Stat
 * @global
 * @property {string} type - Type of evidence item
 * @property {number} count_in - Incoming evidence item count
 * @property {number} count_out - Outgoing evidence item count
 */

/**
 * @typedef {('email'|'voicemail'|'video'|'text')} EvidenceItemType
 * @global
 */

Object.defineProperty(String.prototype, "toTitle", {
  value() {
    return this.substring(0, 1).toUpperCase() + this.substring(1);
  },
});

// MongoDB connection
import connectDB from "./utils/db.js";
connectDB();

// Start the server
const server = app.listen(process.env.NODE_PORT, async () => {
  let host = server.address().address;
  let port = server.address().port;
  console.log(
    `Express running → http://[${host}]:${port} in ${process.env.NODE_ENV} mode`
  );
});
