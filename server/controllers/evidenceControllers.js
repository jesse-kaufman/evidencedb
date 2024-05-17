// EvidenceItem controller
const EvidenceItem = require("../models/evidenceItemModel");
const { setupQuery } = require("../utils/db");

// List all evidence items
exports.getEvidenceItems = async (req, res) => {
  try {
    var query = setupQuery(req);

    const result = await EvidenceItem.find(query).sort({ date_sent: 1 });
    res.json(result);
  } catch (err) {
    console.log(err);
  }
};

// View a particular evidence item
exports.getEvidenceItem = async (req, res) => {
  let evidenceItem = null;
  try {
    evidenceItem = await EvidenceItem.findById(req.params.id);
    if (evidenceItem === null) {
      return res.status(404).json({ message: "Unable to find item." });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    var query = {
      type: {
        $in: ["voicemail", "text"],
      },
      direction: "IN",
    };

    const result = await EvidenceItem.find(query, "from")
      .sort({
        date_sent: 1,
      })
      .distinct("from");
    res.json(result);
  } catch (err) {
    console.log(err);
  }
};

exports.getDates = async (req, res) => {
  try {
    var query = {};

    query = {
      type: req.params?.evidenceItemID,
    };

    const result = await EvidenceItem.find(query, "date_sent")
      .sort({
        date_sent: 1,
      })
      .distinct("from");
    res.json(result);
  } catch (err) {
    console.log(err);
  }
};
