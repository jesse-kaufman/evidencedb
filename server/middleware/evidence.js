const EvidenceItem = require("../models/evidenceItemModel");

async function getEvidenceItem(req, res, next) {
  let evidenceItem;
  try {
    evidenceItem = await EvidenceItem.findById(req.params.id);
    if (evidenceItem === null) {
      return res.status(400).json({ message: "Unable to find item." });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.evidenceItem = evidenceItem;
  next();
}

module.exports = getEvidenceItem;
