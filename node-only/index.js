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

// MongoDB connection
import connectDB from "./utils/db.js";
connectDB();

// Setup Express
import express from "express";
const app = express();

// Cookie parser
import cookieParser from "cookie-parser";
app.use(cookieParser());

// Enable compression
import compression from "compression";
app.use(compression());

app.use(express.urlencoded({ extended: true }));

// Use CORS
import cors from "cors";
app.use(cors());

app.set("views", "./views");
app.set("view engine", "pug");

// Static routes
app.use("/public", express.static("public"));
app.use("/libs/lightbox2", express.static("node_modules/lightbox2/dist"));

// EvidenceItem routes
import evidenceRoutes from "./routes/evidenceRoutes.js";
app.use("/", evidenceRoutes);

// Start the server
const server = app.listen(process.env.NODE_PORT, () => {
  console.log(
    `Express running → PORT ${server.address().port} in ${
      process.env.NODE_ENV
    } mode`
  );
});
