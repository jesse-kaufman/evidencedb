import EvidenceItem, { validTypes } from "../models/evidenceItemModel.js";
import { getCountAggregation } from "../services/queryService.js";

/**
 * Builds query to pull statistics from MongoDB
 *
 * @param {*} query
 * @returns
 */
const buildTypeStatsPipeline = async (type, baseQuery, include) => {
  const query = Object.assign({}, baseQuery);

  const dateSentDate = query.date_sent_date;
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

  const dateFilter = { $match: { dateSentDate: dateSentDate } };

  // Return complete pipeline array
  return [{ $match: query }, addDateFields, dateFilter, group];
};

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
  const typeStats = await EvidenceItem.aggregate(statsQuery);

  // eslint-disable-next-line no-magic-numbers
  if (typeStats[0]?.in > 0 || typeStats[0]?.out > 0) {
    // Only add to stats if either count is > 0

    return {
      type: type,
      count_in: typeStats[0].in,
      count_out: typeStats[0].out,
    };
  }
};

/**
 * Gets statistics for evidence items based on the specified types and query.
 *
 * @param {Array} include - An array of types to include in the statistics.
 * @param {Object} baseQuery - The core query object to filter the evidence items.
 * @returns {Promise<Array>} - Promise of an array of statistics objects
 */
export const getStats = async (include, baseQuery) => {
  const stats = [];
  let types = [...validTypes, "total"];
  const query = Object.assign({}, baseQuery);

  // eslint-disable-next-line no-magic-numbers
  if (include?.length > 0) {
    // Default to all types if none are specified
    types = [...include, "total"];
  }

  // Count number of evidence items received/sent per type
  for (const type of types) {
    // Get the actual stats from database
    // eslint-disable-next-line no-await-in-loop
    const typeStats = await getTypeStats(type, query, include);

    if (typeStats) {
      // Only add to stats if either count is > 0
      stats.push(typeStats);
    }
  }

  return stats;
};
