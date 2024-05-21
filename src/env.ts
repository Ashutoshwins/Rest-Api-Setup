import { config } from "dotenv";

config();

export const MONGO_DB_CONNECTION_STRING =
  process.env.MONGO_DB_CONNECTION_STRING ||
  "mongodb://localhost:27017/Rest_Api";
export const DB_HOST = process.env.DB_HOST || "localhost";
export const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
export const JWT_SECRET = process.env.JWT_SECRET || "thiisecret865776rr4e*&&*e";
export const PORT = process.env.PORT || 3002;
export const MONGO  = "mongodb://localhost:27017/Rest_Api"

