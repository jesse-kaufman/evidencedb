import { connect } from "mongoose";

export default async (mongoUrl) => {
  try {
    await connect(mongoUrl);
    console.log("Connected to MongoDB!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};
