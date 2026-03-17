import { AppDataSource } from "./database";
import { Question } from "../entities/Question";
import { Career } from "../entities/Career";
import { User } from "../entities/User";
import bcrypt from "bcryptjs";

export const seedData = async () => {
  const questionRepo = AppDataSource.getRepository(Question);
  const careerRepo = AppDataSource.getRepository(Career);
  const userRepo = AppDataSource.getRepository(User);

  // Check if already seeded
  const count = await questionRepo.count();
  if (count > 0) return;

  console.log("Seeding initial data...");

  // Seed Users
  const adminPassword = await bcrypt.hash("admin123", 10);
  await userRepo.save(userRepo.create({
    name: "Admin User",
    email: "admin@example.com",
    password: adminPassword,
    role: "admin"
  }));

  const userPassword = await bcrypt.hash("user123", 10);
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
