
export function getQuery(req) {
  var query = {};

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
  if (req.query.number) {
    query.from = req.query.number;
  }

  // Filter based on evidence item type
  if (req.query.include && req.query.include.length > 0) {
    query.type = { $in: req.query.include };
  }

  return query;
}

export function getStatsQuery(query) {
  return [
    { $match: query },
    {
      $group: {
        _id: null,
        in: {
          $sum: {
            $cond: {
              if: { $eq: ["$direction", "IN"] },
              then: 1,
              else: 0,
            },
          },
        },
        out: {
          $sum: {
            $cond: {
              if: { $eq: ["$direction", "OUT"] },
              then: 1,
              else: 0,
            },
          },
        },
      },
    },
  ];
}
