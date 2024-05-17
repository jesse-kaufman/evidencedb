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
exports.getEvidenceItem = (req, res) => {
  try {
    console.log("sending evidence item " + req.params.evidenceItemID);
    res.json(res.evidenceItem);
  } catch (err) {
    console.log(err);
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
