import { connect } from "mongoose";

export default async function connectDB() {
  try {
    await connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

/**
 * Gets the query object that calculates in/out counts, based on direction
 * @param {*} direction
 * @returns {Promise<Object>} - The $sum aggregation object
 */
export const getCountAggregation = async (direction) => {
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
