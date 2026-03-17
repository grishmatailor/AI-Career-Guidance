import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entities/User";
import { Question } from "../entities/Question";
import { Answer } from "../entities/Answer";
import { Career } from "../entities/Career";
import { Recommendation } from "../entities/Recommendation";
import { AIRecommendation } from "../entities/AIRecommendation";
import dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "ai_career_guidance",
  synchronize: true, // Auto create/update schema (set to false in production)
  logging: false,
  entities: [User, Question, Answer, Career, Recommendation, AIRecommendation],
  migrations: [],
  subscribers: [],
});

export const initializeDatabase = async () => {
  await AppDataSource.initialize();
  console.log("Data Source has been initialized!");
};
