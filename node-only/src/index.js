/**
 * Evidence Database
 *
 * @author Jesse Kaufman <jesse@jessekaufman.com>
 */

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

// Enviroment variables
import dotenv from "dotenv";
dotenv.config();

process.env.BASE_URL = process.env.DEV_BASE_URL;

if (process.env.NODE_ENV === "production") {
  process.env.BASE_URL = process.env.PROD_BASE_URL;
}

// MongoDB connection
import connectDB from "./utils/db.js";
connectDB();

// Setup Express
import express from "express";
const expressApp = express();

// Enable compression
import compression from "compression";
expressApp.use(compression());

expressApp.use(express.urlencoded({ extended: true }));

// Use CORS
import cors from "cors";
expressApp.use(cors());

expressApp.set("views", "src/views");
expressApp.set("view engine", "pug");

let staticOptions = {
  maxAge: "2y",
  etag: false,
};

// Static routes
expressApp.use("/public", express.static("src/public", staticOptions));
expressApp.use(
  "/libs/lightbox2",
  express.static("node_modules/lightbox2/dist", staticOptions)
);
expressApp.use(
  "/libs/jquery/jquery.min.js",
  express.static("node_modules/jquery/dist/jquery.min.js", staticOptions)
);

// EvidenceItem routes
import evidenceRoutes from "./routes/evidenceRoutes.js";
expressApp.use("/", evidenceRoutes);

// Start the server
const server = expressApp.listen(process.env.NODE_PORT, async () => {
  let host = server.address().address;
  let port = server.address().port;
  console.log(
    `Express running → http://[${host}]:${port} in ${process.env.NODE_ENV} mode`
  );
});
