import { AppDataSource } from "./database";
import { Question } from "../entities/Question";
import { User } from "../entities/User";
import bcrypt from "bcryptjs";
import * as fs from "fs";
import * as path from "path";

interface SeedConfig {
  users: Array<{
    name: string;
    email: string;
    password: string;
    role: string;
  }>;
  questions: Array<{
    question: string;
    category: string;
  }>;
}

export const seedData = async () => {
  const questionRepo = AppDataSource.getRepository(Question);
  const userRepo = AppDataSource.getRepository(User);

  // Check if already seeded
  const count = await questionRepo.count();
  if (count > 0) return;

  console.log("Seeding initial data...");

  // Load seed data from external file
  const seedConfigPath = path.join(__dirname, "seedData.json");
  const seedConfig: SeedConfig = JSON.parse(
    fs.readFileSync(seedConfigPath, "utf-8")
  );

  // Seed Users
  for (const userData of seedConfig.users) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    await userRepo.save(
      userRepo.create({
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        role: userData.role,
        assessmentCount: 0,
      })
    );
  }

  // Seed Questions
  await questionRepo.save(questionRepo.create(seedConfig.questions));

  console.log("Seeding complete!");
};
