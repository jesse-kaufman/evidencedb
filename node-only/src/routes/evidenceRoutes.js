// User routes
import evidenceController from "../controllers/evidenceControllers.js";
import express from "express";
import sitemapController from "../controllers/sitemapControllers.js";

const router = new express.Router();

// Sitemap route
router.get("/sitemap.xml", sitemapController.render);

// Main routes
router.get("/", evidenceController.render);
router.get("/evidence-item/:id", evidenceController.redirect);
router.get("/:type/evidence-item/:id", evidenceController.render);
router.get("/:type", evidenceController.render);

export default router;
