const EvidenceItem = require("../models/evidenceItemModel");
const { validTypes, getStatsQuery } = require("../utils/queryUtils");
const { formatPhone } = require("../utils/helpers");

exports.getStats = async (include, query) => {
  let stats = [];
  let types = null;

  // Default to all types if none are specified
  if (!include || !include[0]) {
    types = ["text", "email", "voicemail", "video", "total"];
  } else {
    types = [...include, "total"];
  }

  //
  // Count number of evidence items received/sent per type
  //
  for (let i = 0; i < types.length; i++) {
    if (types[i] !== "total") {
      validTypes.push("");
      // If type is not "total", search evidence items of that type
      if (!validTypes.includes(types[i])) {
        throw new Error("Invalid evidence type");
      }
      query.type = types[i];
    } else {
      // If type is "total", search all evidence items
      delete query.type;
    }

    // Count number of evidence items received/sent
    let counts = await EvidenceItem.aggregate(getStatsQuery(query));

    // Default counts to 0
    let count_in = counts[0]?.in ? counts[0].in : 0;
    let count_out = counts[0]?.out ? counts[0].out : 0;

    // Only add to stats if either count is > 0
    if (count_in > 0 || count_out > 0) {
      stats.push({
        type: types[i],
        count_in: count_in,
        count_out: count_out,
      });
    }
  }

  return stats;
};

exports.getDates = async (include) => {
  // Default to all types if none are specified
  match = {};
  if (include && include[0]) {
    match = { type: { $in: include } };
  }

  let dates = await EvidenceItem.aggregate([
    { $match: match },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$date_sent",
          },
        },
        in: {
          $sum: {
            $cond: {
              if: { $eq: ["$direction", "IN"] },
              then: 1,
              else: 0,
            },
          },
        },
        out: {
          $sum: {
            $cond: {
              if: { $eq: ["$direction", "OUT"] },
              then: 1,
              else: 0,
            },
          },
        },
      },
    },
  ]);

  return dates;
};

exports.getNumbers = async () => {
  let numbers = await EvidenceItem.aggregate([
    {
      $match: {
        type: { $in: ["voicemail", "text"] },
        from: {
          $not: {
            $in: ["3162502647", "3164611421"],
          },
        },
      },
    },
    {
      $group: {
        _id: "$from",
        in: {
          $sum: {
            $cond: {
              if: { $eq: ["$direction", "IN"] },
              then: 1,
              else: 0,
            },
          },
        },
      },
    },
  ]);

  return numbers;
};
