// User routes
const express = require("express");
const router = express.Router();
const evidenceControllers = require("../controllers/evidenceControllers");

router.get("/", evidenceControllers.printEvidence);

module.exports = router;
