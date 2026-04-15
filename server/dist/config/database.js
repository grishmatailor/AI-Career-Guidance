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
const AIRecommendation_1 = require("../entities/AIRecommendation");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, "../.env") });
const isProduction = process.env.NODE_ENV === "production";
exports.AppDataSource = new typeorm_1.DataSource({
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
    entities: [User_1.User, Question_1.Question, Answer_1.Answer, AIRecommendation_1.AIRecommendation],
});
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
