// User routes
import express from "express";
import { printEvidence } from "../controllers/evidenceControllers.js";
import { printSitemap } from "../controllers/sitemapControllers.js";

const router = express.Router();
router.get("/", printEvidence);
router.get("/evidence-item/:id", printEvidence);
router.get("/sitemap.xml", printSitemap);

export default router;
