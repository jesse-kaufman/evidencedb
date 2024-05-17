// EvidenceItem controller
const EvidenceItem = require("../models/evidenceItemModel");
const { setupQuery } = require("../utils/db");
const { getStats } = require("../utils/evidenceUtils");

// List all evidence items
exports.printEvidence = async function (req, res) {
  let query = setupQuery(req);
  let stats = await getStats(query);
  let evidenceItems = await EvidenceItem.find(query).sort({ date_sent: 1 });

  await res.render("index", {
    title: "Evidence",
    evidenceItems: evidenceItems,
    mystats: stats,
  });
};
