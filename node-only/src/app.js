// Setup Express
import compression from "compression";
import cors from "cors";
import evidenceRoutes from "./routes/evidenceRoutes.js";
import express from "express";
import staticRoutes from "./routes/staticRoutes.js";

const expressApp = express();

// Enable compression
expressApp.use(compression());

// Use CORS
expressApp.use(cors());

// Use Pug for templates
expressApp.set("views", "src/views");
expressApp.set("view engine", "pug");
expressApp.locals.basedir = expressApp.get("views");

// Static routes
expressApp.use("/", staticRoutes);

// EvidenceItem routes
expressApp.use("/", evidenceRoutes);

export default expressApp;
