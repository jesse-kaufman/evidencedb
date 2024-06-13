import EvidenceItem from "../models/evidenceItemModel.js";
import { getCountAggregation } from "../services/queryService.js";

/**
 * Get list of dates with in/out counts for search dropdown
 *
 * @param {Array} include - An array of types to include.
 * @returns {Promise<Array>} - An array of date objects containing date, count_in, and count_out.
 */
export async function getDates(include) {
  // Get pipeline array to pull dates
  const datePipeline = await getDatePipeline(include);

  // Return list of dates with in/out counts
  return await EvidenceItem.aggregate(datePipeline);
}

/**
 * Gets aggregat pipeline array to pull dates and counts from database
 *
 * @param {*} include
 * @returns
 */
const getDatePipeline = async (include) => {
  // Default to all types if none are specified
  let match = {};
  if (include && include[0]) {
    match = { type: { $in: include } };
  }

  // Group by date and sum number of evidence items received/sent
  const group = await getGroupAggregationStage();

  // Sort by date ascending
  const sort = { $sort: { _id: 1 } };

  // Return complete pipeline array
  return [{ $match: match }, group, sort];
};

/**
 * Gets the $group aggregation stage for pipeline
 *
 * @returns {Promise<Object>} - The $group aggregation stage
 */
const getGroupAggregationStage = async () => {
  // Group by date_sent formatted as "YYYY-MM-DD" and count items sent/received
  return {
    $group: {
      _id: {
        $dateToString: {
          format: "%Y-%m-%d",
          date: "$date_sent",
          timezone: process.env.TZ,
        },
      },
      in: await getCountAggregation("IN"),
      out: await getCountAggregation("OUT"),
    },
  };
};
