// EvidenceItem controller
const EvidenceItem = require("../models/evidenceItemModel");
const { getQuery } = require("../utils/queryUtils");
const { getStats, getDates, getNumbers } = require("../utils/evidenceUtils");
const {
  formatPhone,
  formatVideoTranscript,
  formatDuration,
} = require("../utils/helpers");

// List evidence items
exports.printEvidence = async function (req, res) {
  let numbers = null;
  let query = getQuery(req);
  let stats = await getStats(req.query.include, query);
  let evidenceItems = await EvidenceItem.aggregate([{ $match: query }])
    .sort({
      date_sent: 1,
    })
    .project({
      type: 1,
      date_sent: 1,
      from: 1,
      to: 1,
      direction: 1,
      victim: 1,
      body: 1,
      body_html: 1,
      subject: 1,
      duration: 1,
      filename: 1,
      attachments: 1,
      title: 1,
      formattedDate: {
        $dateToString: { format: "%b %d, %Y", date: "$date_sent" },
      },
    });
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
    cdn_url: process.env.CDN,
    formatPhone: formatPhone,
    formatVideoTranscript: formatVideoTranscript,
    formatDuration: formatDuration,
  });
};
