// User routes
import evidenceController from "../controllers/evidenceControllers.js";
import express from "express";
import sitemapController from "../controllers/sitemapControllers.js";

const router = new express.Router();
router.get("/", evidenceController.render);
router.get("/evidence-item/:id", evidenceController.render);
router.get("/sitemap.xml", sitemapController.render);

export default router;
