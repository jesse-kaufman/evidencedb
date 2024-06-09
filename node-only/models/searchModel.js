import EvidenceItem from "../models/evidenceItemModel.js";

/**
 * Gets the query object that calculates in/out counts, based on direction
 * @param {*} direction
 * @returns {Promise<Object>} - The $sum aggregation object
 */
const getCountAggregation = async (direction) => {
  return {
    $sum: {
      $cond: {
        if: { $eq: ["$direction", direction.toUpperCase()] },
        then: 1,
        else: 0,
      },
    },
  };
};

/**
 * Gets the $group aggregation stage for date query
 *
 * @returns {Promise<Object>} - The $group aggregation stage
 */
const getGroupAggregationStage = async () => {
  // Get object to count number of evidence items sent per date
  const outCount = await getCountAggregation("OUT");

  // Get object to count number of evidence items received per date
  const inCount = await getCountAggregation("IN");

  // Group by date_sent formatted as "YYYY-MM-DD"
  return {
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
};

/**
 * Gets aggregat pipeline array to pull dates and counts from database
 *
 * @param {*} include
 * @returns
 */
const getDateQuery = async (include) => {
  // Default to all types if none are specified
  let match = {};
  if (include && include[0]) {
    match = { $match: { type: { $in: include } } };
  }

  // Group by date and sum number of evidence items received/sent
  const group = await getGroupAggregationStage();

  // Sort by date ascending
  const sort = { $sort: { _id: 1 } };

  return [match, group, sort];
};

/**
 * Get list of dates with in/out counts for search dropdown
 *
 * @param {Array} include - An array of types to include.
 * @returns {Promise<Array>} - An array of date objects containing date, count_in, and count_out.
 */
export async function getDates(include) {
  // Get $match, $group, and $sort objects for query
  const dateQuery = await getDateQuery(include);

  // Return list of dates with in/out counts
  return await EvidenceItem.aggregate(dateQuery);
}
