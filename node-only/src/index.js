/**
 * Evidence Database
 *
 * @author Jesse Kaufman <jesse@jessekaufman.com>
 */
import config from "./config/config.js";
import app from "./app.js";
import connectDB from "./config/db.js";
connectDB(config.mongoUrl);

// Start the server
const server = app.listen(process.env.NODE_PORT, async () => {
  let host = server.address().address;
  let port = server.address().port;
  console.log(
    `Express running → http://[${host}]:${port} in ${process.env.NODE_ENV} mode`
  );
});
