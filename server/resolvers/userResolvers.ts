import { AppDataSource } from "../config/database";
import { User } from "../entities/User";
import bcrypt from "bcryptjs";
import { generateToken } from "../middleware/auth";
import { getAIResponse } from "../services/aiService";

import { AuthUser } from "../middleware/auth";

export const userResolvers = {
  Query: {
    me: async (_: unknown, __: unknown, { user }: { user: AuthUser | null }) => {
      if (!user) return null;
      return await AppDataSource.getRepository(User).findOneBy({ id: user.id });
    },
    getAllUsers: async (_: unknown, __: unknown, { user }: { user: AuthUser | null }) => {
      if (!user || user.role !== "admin") throw new Error("Unauthorized");
      return await AppDataSource.getRepository(User).find();
    },
  },
  Mutation: {
    registerUser: async (
      _: unknown,
      { name, email, password, role }: any
    ) => {
      const userRepository = AppDataSource.getRepository(User);
      const existingUser = await userRepository.findOneBy({ email });
      if (existingUser) throw new Error("User already exists");

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = userRepository.create({
        name,
        email,
        password: hashedPassword,
        role: role || "user",
      });

      await userRepository.save(user);
      const token = generateToken({ id: user.id, email: user.email, role: user.role });

      return { token, user };
    },
    loginUser: async (_: any, { email, password }: any) => {
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOneBy({ email });
      if (!user) throw new Error("Invalid credentials");

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) throw new Error("Invalid credentials");

      const token = generateToken({ id: user.id, email: user.email, role: user.role });

      return { token, user };
    },
    chatCareer: async (
      _: unknown,
      { message }: { message: string },
      { user }: { user: AuthUser | null }
    ) => {
      if (!user) throw new Error("Unauthorized");
      const dbUser = await AppDataSource.getRepository(User).findOneBy({
        id: user.id,
      });
      const userData = {
        name: dbUser?.name,
        email: dbUser?.email,
        education: dbUser?.education,
      };
      const reply = await getAIResponse(message, userData);
      return reply ?? "I'm unable to respond right now. Please try again.";
    },
  },
};
