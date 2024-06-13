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

/**
 * Gets query object to filter documents in the $match aggregation and find()
 *
 * @param {*} db
 * @param {*} req
 * @returns
 */
export const getQuery = async (db, req) => {
  var query = {};

  if (req.params.id) {
    query._id = new db.Types.ObjectId(req.params.id);
  }

  // Filter based on evidence item body
  if (req.query.query) {
    query.$text = { $search: `"${req.query.query}"` };
  }

  // Filter based on victim
  if (req.query.victim && req.query.victim !== "both") {
    query.victim = { $in: ["both", req.query.victim] };
    if (req.query.victim === "others") {
      query.victim = "others";
    }
  }

  // Filter based on phone number
  if (req.query.date_sent_date) {
    query.date_sent_date = req.query.date_sent_date;
  }

  // Filter based on evidence item type
  if (req.query.include && req.query.include.length > 0) {
    query.type = { $in: fixIncludeTypes(req.query.include) };
  }

  return query;
};

/**
 * Replaces "s" in each item in types array to fix old URLs
 * @param {*} types
 * @returns
 */
const fixIncludeTypes = (types) => {
  return types.map((type) => {
    if (type.match(/s$/)) {
      return type.slice(0, -1);
    }
    return type;
  });
};
