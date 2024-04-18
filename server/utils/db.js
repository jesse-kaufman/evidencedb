//

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

const setupQuery = (req) => {
  var query = {};

  if (req.query.query) {
    query.$text = { $search: `\"${req.query.query}\"` };
  }
  if (req.query.date) {
    query.date_sent = req.query.date;
  }
  if (req.query.victim) {
    query.victim = req.query.victim;
  }
  if (req.query.number) {
    query.from = req.query.number;
  }
  if (req.query.include) {
    query.type = { $in: req.query.include };
  }

  return query;
};

module.exports = { connectDB, setupQuery };
