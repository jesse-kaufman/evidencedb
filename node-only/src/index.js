/**
 * Evidence Database
 *
 * @author Jesse Kaufman <jesse@jessekaufman.com>
 */
import app from './app.js'
import config from './config/config.js'
import connectDB from './config/db.js'
connectDB(config.mongoUrl)

// Start the server
const server = app.listen(process.env.NODE_PORT, () => {
  const { address, port } = server.address()
  console.log(
    `Express running → http://[${address}]:${port} in ${process.env.NODE_ENV} mode`,
  )
})
