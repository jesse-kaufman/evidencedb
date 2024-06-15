/**
 * Gets the query object that calculates in/out counts, based on direction
 * @param {*} direction
 * @returns {Promise<Object>} - The $sum aggregation object
 */

const getVictimFilter = async (victim) => {
  // Victim is set and is not "both"
  if (victim) {
    if (["jesse", "shannon"].includes(victim)) {
      return { victim: { $in: ["both", victim] } };
    }

    return victim;
  }
};

const getQueryFilter = async (query) => {
  if (query) {
    return { $text: { $search: `"${query}"` } };
  }
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

const getDateFilter = async (dateSentDate) => {
  if (dateSentDate) {
    return { date_sent_date: dateSentDate };
  }
};

const getTypeFilter = async (include) => {
  // Filter based on evidence item type
  if (include && include.length > 0) {
    return { type: { $in: fixIncludeTypes(include) } };
  }
};

export const getCountAggregation = async (direction) => ({
  $sum: {
    $cond: {
      if: { $eq: ["$direction", direction.toUpperCase()] },
      then: 1,
      else: 0,
    },
  },
});

/**
 * Gets query object to filter documents in the $match aggregation and find()
 *
 * @param {*} db
 * @param {*} req
 * @returns
 */
export const getQuery = async (db, req) => {
  let query = {};

  // Filter based on evidence item id and return immediately
  if (req.params.id) {
    query._id = new db.Types.ObjectId(req.params.id);
    return query;
  }

  // Filter based on evidence item body
  let queryFilter = await getQueryFilter(req.query.query);
  query = { ...query, ...queryFilter };

  // Filter based on victim
  let victimFilter = await getVictimFilter(req.query.victim);
  query = { ...query, ...victimFilter };

  // Filter based on date
  let dateFilter = await getDateFilter(req.query.date_sent_date);
  query = { ...query, ...dateFilter };

  // Filter based on evidence item type
  let typeFilter = await getTypeFilter(req.query.include);
  query = { ...query, ...typeFilter };

  return query;
};
