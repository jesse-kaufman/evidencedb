// User routes
import express from "express";
import evidenceController from "../controllers/evidenceControllers.js";
import sitemapController from "../controllers/sitemapControllers.js";

const router = express.Router();
router.get("/", evidenceController.render);
router.get("/evidence-item/:id", evidenceController.render);
router.get("/sitemap.xml", sitemapController.render);

export default router;
