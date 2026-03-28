"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userResolvers = void 0;
const database_1 = require("../config/database");
const User_1 = require("../entities/User");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const auth_1 = require("../middleware/auth");
const aiService_1 = require("../services/aiService");
exports.userResolvers = {
    Query: {
        me: async (_, __, { user }) => {
            if (!user)
                return null;
            return await database_1.AppDataSource.getRepository(User_1.User).findOneBy({ id: user.id });
        },
        getAllUsers: async (_, __, { user }) => {
            if (!user || user.role !== "admin")
                throw new Error("Unauthorized");
            return await database_1.AppDataSource.getRepository(User_1.User).find();
        },
    },
    Mutation: {
        registerUser: async (_, { name, email, password, role }) => {
            const userRepository = database_1.AppDataSource.getRepository(User_1.User);
            const existingUser = await userRepository.findOneBy({ email });
            if (existingUser)
                throw new Error("User already exists");
            const hashedPassword = await bcryptjs_1.default.hash(password, 10);
            const user = userRepository.create({
                name,
                email,
                password: hashedPassword,
                role: role || "user",
            });
            await userRepository.save(user);
            const token = (0, auth_1.generateToken)({ id: user.id, email: user.email, role: user.role });
            return { token, user };
        },
        loginUser: async (_, { email, password }) => {
            const userRepository = database_1.AppDataSource.getRepository(User_1.User);
            const user = await userRepository.findOneBy({ email });
            if (!user)
                throw new Error("Invalid credentials");
            const isValid = await bcryptjs_1.default.compare(password, user.password);
            if (!isValid)
                throw new Error("Invalid credentials");
            const token = (0, auth_1.generateToken)({ id: user.id, email: user.email, role: user.role });
            return { token, user };
        },
        chatCareer: async (_, { message }, { user }) => {
            if (!user)
                throw new Error("Unauthorized");
            const dbUser = await database_1.AppDataSource.getRepository(User_1.User).findOneBy({
                id: user.id,
            });
            const userData = {
                name: dbUser?.name,
                email: dbUser?.email,
                education: dbUser?.education,
            };
            const reply = await (0, aiService_1.getAIResponse)(message, userData);
            return reply ?? "I'm unable to respond right now. Please try again.";
        },
    },
};
