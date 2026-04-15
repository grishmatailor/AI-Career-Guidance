"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedData = void 0;
const database_1 = require("./database");
const Question_1 = require("../entities/Question");
const User_1 = require("../entities/User");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const seedData = async () => {
    const questionRepo = database_1.AppDataSource.getRepository(Question_1.Question);
    const userRepo = database_1.AppDataSource.getRepository(User_1.User);
    // Check if already seeded
    const count = await questionRepo.count();
    if (count > 0)
        return;
    console.log("Seeding initial data...");
    // Load seed data from external file
    const seedConfigPath = path.join(__dirname, "seedData.json");
    const seedConfig = JSON.parse(fs.readFileSync(seedConfigPath, "utf-8"));
    // Seed Users
    for (const userData of seedConfig.users) {
        const hashedPassword = await bcryptjs_1.default.hash(userData.password, 10);
        await userRepo.save(userRepo.create({
            name: userData.name,
            email: userData.email,
            password: hashedPassword,
            role: userData.role,
            assessmentCount: 0,
        }));
    }
    // Seed Questions
    await questionRepo.save(questionRepo.create(seedConfig.questions));
    console.log("Seeding complete!");
};
exports.seedData = seedData;
