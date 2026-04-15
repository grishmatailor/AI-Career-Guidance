"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.questionResolvers = void 0;
const database_1 = require("../config/database");
const Question_1 = require("../entities/Question");
const Answer_1 = require("../entities/Answer");
const User_1 = require("../entities/User");
exports.questionResolvers = {
    Query: {
        getQuestions: async () => {
            return await database_1.AppDataSource.getRepository(Question_1.Question).find();
        },
    },
    Mutation: {
        createQuestion: async (_, args, { user }) => {
            if (!user || user.role !== "admin")
                throw new Error("Unauthorized");
            const questionRepository = database_1.AppDataSource.getRepository(Question_1.Question);
            const question = questionRepository.create(args);
            return await questionRepository.save(question);
        },
        updateQuestion: async (_, { id, ...args }, { user }) => {
            if (!user || user.role !== "admin")
                throw new Error("Unauthorized");
            const questionRepository = database_1.AppDataSource.getRepository(Question_1.Question);
            await questionRepository.update(id, args);
            return await questionRepository.findOneBy({ id });
        },
        deleteQuestion: async (_, { id }, { user }) => {
            if (!user || user.role !== "admin")
                throw new Error("Unauthorized");
            await database_1.AppDataSource.getRepository(Question_1.Question).delete(id);
            return true;
        },
        submitAssessment: async (_, { answers }, { user }) => {
            if (!user)
                throw new Error("Unauthorized");
            const answerRepo = database_1.AppDataSource.getRepository(Answer_1.Answer);
            const userRepo = database_1.AppDataSource.getRepository(User_1.User);
            // Clear old answers
            await answerRepo.delete({ user: { id: user.id } });
            // Increment assessment count
            await userRepo.increment({ id: user.id }, "assessmentCount", 1);
            const answerEntities = answers.map((a) => answerRepo.create({
                user: { id: user.id },
                question: { id: a.question_id },
                answer: a.answer
            }));
            await answerRepo.save(answerEntities);
            return true;
        },
    },
};
