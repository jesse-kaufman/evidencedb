/**
 * Evidence utils
 *
 * @module utils/evidenceUtils
 * @author Jesse Kaufman <jesse@jessekaufman.com>
 */

import EvidenceItem from "../models/evidenceItemModel.js";
import { getStatsQuery } from "../utils/queryUtils.js";
import { validTypes } from "../models/evidenceItemModel.js";

/**
 * Get statistics for evidence items based on the specified types and query.
 *
 * @param {Array.<EvidenceItemType>} include - An array of types to include in the statistics.
 * @param {Object} core_query - The core query object to filter the evidence items.
 * @returns {Promise<Array.<Stat>>} - Promise of an array of statistics objects
 */
export async function getStats(include, core_query) {
  let stats = [];
  let types = null;
  let query = Object.assign({}, core_query);

  // Default to all types if none are specified
  if (!include || !include[0]) {
    types = [...validTypes, "total"];
  } else {
    types = [...include, "total"];
  }

  //
  // Count number of evidence items received/sent per type
  //
  for (let i = 0; i < types.length; i++) {
    if (types[i] !== "total") {
      // If type is not "total", search evidence items of that type
      validTypes.push("");
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
}

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

  // Get list of dates with in/out counts
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
}

/**
 * Get list of phone numbers with in counts.
 *
 * @param {Array} include - An array of types to include.
 * @returns {Promise<Array>} - An array of objects containing phone number and count of items.
 */
export async function getNumbers() {
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
}
