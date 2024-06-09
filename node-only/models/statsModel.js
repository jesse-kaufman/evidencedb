import EvidenceItem from "../models/evidenceItemModel.js";
import { validTypes } from "../models/evidenceItemModel.js";

/**
 * Gets stats for a given evidence item type
 *
 * @param {*} type
 * @param {*} query
 * @returns
 */
const getTypeStats = async (type, query) => {
  // Search all evidence items by default
  delete query.type;

  // If type is not "total", search evidence items of that type
  if (type !== "total") {
    query.type = type;
  }

  // Get query to pull statistics for type
  const statsQuery = await buildStatsQuery(query);

  // Get number of evidence items received/sent for type
  return await EvidenceItem.aggregate(statsQuery);
};

/**
 * Builds query to pull statistics from MongoDB
 *
 * @param {*} query
 * @returns
 */
const buildStatsQuery = async (query) => {
  const inCount = {
    $sum: {
      $cond: {
        if: { $eq: ["$direction", "IN"] },
        then: 1,
        else: 0,
      },
    },
  };

  const outCount = {
    $sum: {
      $cond: {
        if: { $eq: ["$direction", "OUT"] },
        then: 1,
        else: 0,
      },
    },
  };

  const group = {
    $group: {
      _id: null,
      in: inCount,
      out: outCount,
    },
  };

  return [{ $match: query }, group];
};

/**
 * Gets statistics for evidence items based on the specified types and query.
 *
 * @param {Array.<EvidenceItemType>} include - An array of types to include in the statistics.
 * @param {Object} core_query - The core query object to filter the evidence items.
 * @returns {Promise<Array.<Stat>>} - Promise of an array of statistics objects
 */
export const getStats = async (include, core_query) => {
  let stats = [];
  let types = null;
  let query = Object.assign({}, core_query);

  // Default to all types if none are specified
  if (include == null || include[0] == null) {
    types = [...validTypes, "total"];
  } else {
    types = [...include, "total"];
  }

  // Count number of evidence items received/sent per type
  for (const type of types) {
    // Get the actual stats from database
    const typeStats = await getTypeStats(type, query);

    // Default counts to 0
    const count_in = typeStats[0]?.in || 0;
    const count_out = typeStats[0]?.out || 0;

    // Only add to stats if either count is > 0
    if (count_in > 0 || count_out > 0) {
      stats.push({
        type: type,
        count_in: count_in,
        count_out: count_out,
      });
    }
  }

  return stats;
};
