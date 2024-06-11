import mongoose from "mongoose";

export async function getQuery(req) {
  var query = {};

  if (req.params.id) {
    query._id = new mongoose.Types.ObjectId(req.params.id);
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
    let types = [];
    types = req.query.include.map((type) => {
      if (type.match(/s$/)) {
        return type.slice(0, -1);
      }
      return type;
    });
    query.type = { $in: types };
  }

  return query;
}
