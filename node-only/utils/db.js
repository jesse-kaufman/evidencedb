import { connect } from "mongoose";

export default async function connectDB() {
  try {
    await connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}
