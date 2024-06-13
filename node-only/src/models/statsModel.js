import EvidenceItem from "../models/evidenceItemModel.js";
import { validTypes } from "../models/evidenceItemModel.js";
import { getCountAggregation } from "../services/queryService.js";

/**
 * Gets stats for a given evidence item type
 *
 * @param {*} type
 * @param {*} query
 * @returns
 */
const getTypeStats = async (type, query, include) => {
  // Get query to pull statistics for type
  const statsQuery = await buildTypeStatsPipeline(type, query, include);

  // Get number of evidence items received/sent for type
  return await EvidenceItem.aggregate(statsQuery);
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
    const typeStats = await getTypeStats(type, query, include);

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

/**
 * Builds query to pull statistics from MongoDB
 *
 * @param {*} query
 * @returns
 */
const buildTypeStatsPipeline = async (type, core_query, include) => {
  let query = Object.assign({}, core_query);

  let dateSentDate = query.date_sent_date;
  delete query.date_sent_date;

  // Default to searching all included types
  delete query.type;

  // If include was set, only include those types
  if (include != null) {
    query.type = { $in: include };
  }

  // If type is not "total", search evidence items of that type
  if (type !== "total") {
    query.type = type;
  }

  // Group by type and count in/out items
  const group = {
    $group: {
      _id: null,
      in: await getCountAggregation("IN"),
      out: await getCountAggregation("OUT"),
    },
  };

  // If not filtering by date, return pipeline
  if (dateSentDate == null) {
    return [{ $match: query }, group];
  }

  const addDateFields = {
    $addFields: {
      dateSentDate: {
        $dateToString: {
          format: "%Y-%m-%d",
          date: "$date_sent",
          timezone: "America/Chicago",
        },
      },
    },
  };

  let dateFilter = { $match: { dateSentDate: dateSentDate } };

  // Return complete pipeline array
  return [{ $match: query }, addDateFields, dateFilter, group];
};
