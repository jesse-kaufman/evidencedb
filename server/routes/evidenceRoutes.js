// User routes
const express = require("express");
const router = express.Router();
const getEvidenceItem = require("../middleware/evidence");

const evidenceControllers = require("../controllers/evidenceControllers");
//const { verifyToken } = require("../middleware/auth");
//console.log(verifyToken);
//router.get("/", verifyToken, evidenceItemControllers.listEvidenceItems);
router.get("/", evidenceControllers.getEvidenceItems);

router.get(
  "/view/:id",
  //verifyToken,
  getEvidenceItem,
  evidenceControllers.getEvidenceItem
);

router.get(
  "/get_numbers/",
  // verifyToken,
  evidenceControllers.getNumbers
);

router.get(
  "/get_dates/",
  // verifyToken,
  evidenceControllers.getDates
);

module.exports = router;
