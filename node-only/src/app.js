// Setup Express
import express from "express";
import compression from "compression";
import cors from "cors";

import staticRoutes from "./routes/staticRoutes.js";
import evidenceRoutes from "./routes/evidenceRoutes.js";

const expressApp = express();

// Enable compression
expressApp.use(compression());

expressApp.use(express.urlencoded({ extended: true }));

// Use CORS
expressApp.use(cors());

expressApp.set("views", "src/views");
expressApp.set("view engine", "pug");

expressApp.use("/", staticRoutes);

// EvidenceItem routes
expressApp.use("/", evidenceRoutes);

export default expressApp;
