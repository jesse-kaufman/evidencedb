// Environment variables

const baseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.BASE_URL
    : process.env.DEV_BASE_URL;

export default {
  baseUrl,
  mongoUrl: process.env.MONGO_URL,
};
