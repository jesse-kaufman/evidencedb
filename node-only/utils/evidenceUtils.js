const EvidenceItem = require("../models/evidenceItemModel");

exports.getStats = async (query) => {
  let stats = [];
  let types = null;

  if (!query.type) {
    types = ["text", "email", "voicemail", "video"];
  } else {
    types = query.type;
  }

  for (let i = 0; i < types.length; i++) {
    query.type = types[i];
    let count = await EvidenceItem.countDocuments(query);
    stats.push({ type: types[i], count: count });
  }

  delete query.type;

  let count = await EvidenceItem.countDocuments(query);
  stats.push({ type: "total", count: count });

  return stats;
};
