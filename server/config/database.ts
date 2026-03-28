import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entities/User";
import { Question } from "../entities/Question";
import { Answer } from "../entities/Answer";
import { Career } from "../entities/Career";
import { Recommendation } from "../entities/Recommendation";
import { AIRecommendation } from "../entities/AIRecommendation";
import dotenv from "dotenv";

import path from "path";

dotenv.config({ path: path.join(__dirname, "../.env") });

// export const AppDataSource = new DataSource({
//   type: "postgres",
//   url: process.env.DATABASE_URL, // Preferred for Neon/Supabase
//   host: process.env.DB_HOST || "localhost",
//   port: parseInt(process.env.DB_PORT || "5432"),
//   username: process.env.DB_USER || "postgres",
//   password: process.env.DB_PASSWORD || "postgres",
//   database: process.env.DB_NAME || "ai_career_guidance",
//   synchronize: process.env.NODE_ENV === "development", // Set to false in production for safety
//   logging: false,
//   ssl: {
//     rejectUnauthorized: false, 
//   },
//   // ssl: process.env.DATABASE_URL || process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
//   entities: [User, Question, Answer, Career, Recommendation, AIRecommendation],
//   migrations: [],
//   subscribers: [],
// });
export const AppDataSource = new DataSource({
  type: "postgres",

  // ✅ Use Supabase connection string
  url: process.env.DATABASE_URL,

  // ❌ REMOVE these in production
  // host: process.env.DB_HOST || "localhost",
  // port: parseInt(process.env.DB_PORT || "5432"),
  // username: process.env.DB_USER || "postgres",
  // password: process.env.DB_PASSWORD || "postgres",
  // database: process.env.DB_NAME || "ai_career_guidance",

  synchronize: false, // ⚠️ ALWAYS false in production
  logging: true,

  ssl: {
    rejectUnauthorized: false,
  },

  entities: [User, Question, Answer, Career, Recommendation, AIRecommendation],
  migrations: [],
  subscribers: [],
});
// const isProduction = process.env.NODE_ENV === "production";

// export const AppDataSource = new DataSource({
//   type: "postgres",

//   ...(process.env.DATABASE_URL
//     ? {
//         url: process.env.DATABASE_URL,
//         ssl: { rejectUnauthorized: false },
//       }
//     : {
//         host: process.env.DB_HOST || "localhost",
//         port: parseInt(process.env.DB_PORT || "5432"),
//         username: process.env.DB_USER || "postgres",
//         password: process.env.DB_PASSWORD || "postgres",
//         database: process.env.DB_NAME || "ai_career_guidance",
//       }),

//   synchronize: !isProduction,
//   logging: false,

//   entities: [User, Question, Answer, Career, Recommendation, AIRecommendation],
// });
console.log("DATABASE_URL:", process.env.DATABASE_URL);

let dataSource: DataSource | null = null;

export const initializeDatabase = async () => {
  if (dataSource && dataSource.isInitialized) {
    return dataSource;
  }

  dataSource = await AppDataSource.initialize();
  console.log("DB Connected");

  return dataSource;
};