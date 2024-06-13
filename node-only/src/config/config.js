// Enviroment variables
import dotenv from "dotenv";

const setup = async () => {
  dotenv.config();

  process.env.BASE_URL = process.env.DEV_BASE_URL;

  if (process.env.NODE_ENV === "production") {
    process.env.BASE_URL = process.env.PROD_BASE_URL;
  }
};

export default { setup };
