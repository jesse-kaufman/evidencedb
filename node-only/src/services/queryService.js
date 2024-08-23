/**
 * Gets the query object that calculates in/out counts, based on direction
 * @param {*} direction
 * @returns {Promise<Object>} - The $sum aggregation object
 */

const getVictimFilter = (victimName) => {
  // Victim is set and is not "both"
  if (victimName) {
    if (['jesse', 'shannon'].includes(victimName)) {
      return { victim: { $in: ['both', victimName] } }
    }

    return { victim: victimName }
  }
}

const getQueryFilter = (query) => {
  if (query) {
    return { $text: { $search: `"${query}"` } }
  }
}

/**
 * Replaces "s" in each item in types array to fix old URLs
 * @param {*} types
 * @returns
 */
const fixIncludeTypes = (types) => {
  return types.map((type) => {
    if (type.match(/s$/)) {
      // eslint-disable-next-line no-magic-numbers
      return type.slice(0, -1)
    }
    return type
  })
}

const getDateFilter = (dateSentDate) => {
  if (dateSentDate) {
    return { date_sent_date: dateSentDate }
  }
}

const getTypeFilter = (include) => {
  // Filter based on evidence item type
  if (include && include.length > 0) {
    return { type: { $in: fixIncludeTypes(include) } }
  }
}

export const getCountAggregation = async (direction) => ({
  $sum: {
    $cond: {
      if: { $eq: ['$direction', await direction.toUpperCase()] },
      then: 1,
      else: 0,
    },
  },
})

/**
 * Gets query object to filter documents in the $match aggregation and find()
 *
 * @param {*} db
 * @param {*} req
 * @returns
 */
export const getQuery = async (db, req) => {
  let query = {}

  // Filter based on evidence item id and return immediately
  if (req.params.id) {
    query._id = db.Types.ObjectId.createFromHexString(req.params.id)
    return query
  }

  // Filter based on evidence item body
  const queryFilter = await getQueryFilter(req.query.query)
  query = { ...query, ...queryFilter }

  // Filter based on victim
  const victimFilter = await getVictimFilter(req.query.victim)
  query = { ...query, ...victimFilter }

  // Filter based on date
  const dateFilter = await getDateFilter(req.query.date_sent_date)
  query = { ...query, ...dateFilter }

  // Filter based on evidence item type
  const typeFilter = await getTypeFilter(req.query.include)
  query = { ...query, ...typeFilter }

  return query
}
