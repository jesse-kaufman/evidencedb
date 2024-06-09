import EvidenceItem from "../models/evidenceItemModel.js";

/**
 * Get list of dates with in/out counts.
 *
 * @param {Array} include - An array of types to include.
 * @returns {Promise<Array>} - An array of date objects containing date, count_in, and count_out.
 */
export async function getDates(include) {
  // Default to all types if none are specified
  let match = {};
  if (include && include[0]) {
    match = { type: { $in: include } };
  }

  // Count number of evidence items received per date
  const inCount = {
    $sum: {
      $cond: {
        if: { $eq: ["$direction", "IN"] },
        then: 1,
        else: 0,
      },
    },
  };

  // Count number of evidence items sent per date
  const outCount = {
    $sum: {
      $cond: {
        if: { $eq: ["$direction", "OUT"] },
        then: 1,
        else: 0,
      },
    },
  };

  // Group by date and sum number of evidence items received/sent
  const group = {
    $group: {
      _id: {
        $dateToString: {
          format: "%Y-%m-%d",
          date: "$date_sent",
          timezone: process.env.TZ,
        },
      },
      in: inCount,
      out: outCount,
    },
  };

  // Sort by date ascending
  const sort = { $sort: { _id: 1 } };

  // Return list of dates with in/out counts
  return await EvidenceItem.aggregate([{ $match: match }, group, sort]);
}
