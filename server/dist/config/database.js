"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDatabase = exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const User_1 = require("../entities/User");
const Question_1 = require("../entities/Question");
const Answer_1 = require("../entities/Answer");
const Career_1 = require("../entities/Career");
const Recommendation_1 = require("../entities/Recommendation");
const AIRecommendation_1 = require("../entities/AIRecommendation");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, "../.env") });
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
exports.AppDataSource = new typeorm_1.DataSource({
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
    entities: [User_1.User, Question_1.Question, Answer_1.Answer, Career_1.Career, Recommendation_1.Recommendation, AIRecommendation_1.AIRecommendation],
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
let dataSource = null;
const initializeDatabase = async () => {
    if (dataSource && dataSource.isInitialized) {
        return dataSource;
    }
    dataSource = await exports.AppDataSource.initialize();
    console.log("DB Connected");
    return dataSource;
};
exports.initializeDatabase = initializeDatabase;
