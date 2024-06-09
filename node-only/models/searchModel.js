import EvidenceItem from "../models/evidenceItemModel.js";

/**
 * Gets the query object that calculates in/out counts, based on direction
 * @param {*} direction
 * @returns {Promise<Object>} - The $sum object for direction
 */
const getCountQueryObject = async (direction) => {
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
 * Gets the $group aggregate object for date query
 *
 * @returns {Promise<Object>} - The $group aggregate
 */
const getGroupQueryObject = async () => {
  // Get object to count number of evidence items sent per date
  const outCount = await getCountQueryObject("OUT");

  // Get object to count number of evidence items received per date
  const inCount = await getCountQueryObject("IN");

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
 * Get list of dates with in/out counts for search dropdown
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

  // Group by date and sum number of evidence items received/sent
  const group = await getGroupQueryObject();

  // Sort by date ascending
  const sort = { $sort: { _id: 1 } };

  // Return list of dates with in/out counts
  return await EvidenceItem.aggregate([{ $match: match }, group, sort]);
}
