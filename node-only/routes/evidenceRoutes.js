// User routes
import express from "express";
import { printEvidence } from "../controllers/evidenceControllers.js";

const router = express.Router();
router.get("/", printEvidence);

export default router;
