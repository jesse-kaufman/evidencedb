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
