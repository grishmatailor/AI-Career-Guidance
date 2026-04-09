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

const isProduction = process.env.NODE_ENV === "production";

export const AppDataSource = new DataSource({
  type: "postgres",

  ...(process.env.DATABASE_URL
    ? {
        url: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
      }
    : {
        host: process.env.DB_HOST || "localhost",
        port: parseInt(process.env.DB_PORT || "5432"),
        username: process.env.DB_USER || "postgres",
        password: process.env.DB_PASSWORD || "postgres",
        database: process.env.DB_NAME || "AIC",
      }),

  synchronize: !isProduction,
  logging: false,

  entities: [User, Question, Answer, Career, Recommendation, AIRecommendation],
});

let dataSource: DataSource | null = null;

export const initializeDatabase = async () => {
  if (dataSource && dataSource.isInitialized) {
    return dataSource;
  }

  dataSource = await AppDataSource.initialize();
  console.log("DB Connected");

  return dataSource;
};