// Environment variables

export default {
  baseUrl:
    process.env.NODE_ENV === 'production'
      ? process.env.PROD_BASE_URL
      : process.env.DEV_BASE_URL,
  mongoUrl: process.env.MONGO_URL,
}
