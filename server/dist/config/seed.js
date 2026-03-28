"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedData = void 0;
const database_1 = require("./database");
const Question_1 = require("../entities/Question");
const Career_1 = require("../entities/Career");
const User_1 = require("../entities/User");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const seedData = async () => {
    const questionRepo = database_1.AppDataSource.getRepository(Question_1.Question);
    const careerRepo = database_1.AppDataSource.getRepository(Career_1.Career);
    const userRepo = database_1.AppDataSource.getRepository(User_1.User);
    // Check if already seeded
    const count = await questionRepo.count();
    if (count > 0)
        return;
    console.log("Seeding initial data...");
    // Seed Users
    const adminPassword = await bcryptjs_1.default.hash("admin123", 10);
    await userRepo.save(userRepo.create({
        name: "Admin User",
        email: "admin@example.com",
        password: adminPassword,
        role: "admin"
    }));
    const userPassword = await bcryptjs_1.default.hash("user123", 10);
    await userRepo.save(userRepo.create({
        name: "Demo Student",
        email: "user@example.com",
        password: userPassword,
        role: "user"
    }));
    // Seed Questions
    const questions = [
        { question: "What are your primary interests?", category: "interests" },
        { question: "Which subjects did you enjoy most in school?", category: "interests" },
        { question: "List your top 3 technical or soft skills.", category: "skills" },
        { question: "How would you describe your personality (Introvert/Extrovert, Analytical, Creative)?", category: "personality" },
        { question: "What is your current or highest level of education?", category: "education" }
    ];
    await questionRepo.save(questionRepo.create(questions));
    // Seed Careers
    const careers = [
        {
            title: "Full Stack Developer",
            description: "Builds both the front-end and back-end of web applications.",
            skills_required: ["JavaScript", "React", "Node.js", "PostgreSQL"],
            salary_range: "$80k - $140k",
            growth_rate: "22%"
        },
        {
            title: "Data Scientist",
            description: "Analyzes complex data sets to provide actionable insights.",
            skills_required: ["Python", "SQL", "Machine Learning", "Statistics"],
            salary_range: "$95k - $160k",
            growth_rate: "36%"
        },
        {
            title: "UX Designer",
            description: "Focuses on the user experience and interface design of products.",
            skills_required: ["Figma", "User Research", "Prototyping", "Visual Design"],
            salary_range: "$70k - $130k",
            growth_rate: "15%"
        }
    ];
    await careerRepo.save(careerRepo.create(careers));
    console.log("Seeding complete!");
};
exports.seedData = seedData;
