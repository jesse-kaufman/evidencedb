import EvidenceItem from "../models/evidenceItemModel.js";
import { validTypes } from "../models/evidenceItemModel.js";

const getStatsQuery = async (query) => {
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
 * Get statistics for evidence items based on the specified types and query.
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
    // Check if type is valid
    if (type !== "total" && !validTypes.includes(type)) {
      throw new Error("Invalid evidence type");
    }

    // Search all evidence items by default
    delete query.type;

    // If type is not "total", search evidence items of that type
    if (type !== "total") {
      query.type = type;
    }

    // Get query to pull statistics for type
    const statsQuery = await getStatsQuery(query);

    // Get number of evidence items received/sent for type
    const counts = await EvidenceItem.aggregate(statsQuery);

    // Default counts to 0
    const count_in = counts[0]?.in || 0;
    const count_out = counts[0]?.out || 0;

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
