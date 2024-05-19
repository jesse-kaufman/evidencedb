// EvidenceItem controller
const EvidenceItem = require("../models/evidenceItemModel");
const { getQuery } = require("../utils/queryUtils");
const { getStats, getDates, getNumbers } = require("../utils/evidenceUtils");

// List evidence items
exports.printEvidence = async function (req, res) {
  let numbers = null;
  let query = getQuery(req);
  let stats = await getStats(req.query.include, query);
  let evidenceItems = await EvidenceItem.find(query).sort({ date_sent: 1 });
  let dates = await getDates(req.query.include);

  if (!req.query.include) {
    numbers = await getNumbers();
    console.log("here");
  }
  console.log(numbers);

  await res.render("index", {
    evidenceItems: evidenceItems,
    stats: stats,
    get: req.query,
    dates: dates,
    numbers: numbers,
  });
};
