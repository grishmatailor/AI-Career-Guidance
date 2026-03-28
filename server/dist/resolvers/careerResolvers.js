"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.careerResolvers = void 0;
const database_1 = require("../config/database");
const Career_1 = require("../entities/Career");
const Recommendation_1 = require("../entities/Recommendation");
const AIRecommendation_1 = require("../entities/AIRecommendation");
const User_1 = require("../entities/User");
const Answer_1 = require("../entities/Answer");
const aiService_1 = require("../services/aiService");
exports.careerResolvers = {
    Query: {
        getCareers: async () => {
            return await database_1.AppDataSource.getRepository(Career_1.Career).find();
        },
        getRecommendations: async (_, __, { user }) => {
            if (!user)
                throw new Error("Unauthorized");
            return await database_1.AppDataSource.getRepository(Recommendation_1.Recommendation).find({
                where: { user: { id: user.id } },
                relations: ["career"],
            });
        },
        getSavedAIRecommendations: async (_, __, { user }) => {
            if (!user)
                throw new Error("Unauthorized");
            return await database_1.AppDataSource.getRepository(AIRecommendation_1.AIRecommendation).find({
                where: { user: { id: user.id } },
                order: { created_at: "DESC" },
            });
        },
        getUserDashboard: async (_, __, { user }) => {
            if (!user)
                throw new Error("Unauthorized");
            return await database_1.AppDataSource.getRepository(Recommendation_1.Recommendation).find({
                where: { user: { id: user.id } },
                relations: ["career"],
            });
        },
        getPopularCareers: async () => {
            // Logic for popular careers (could be based on recommendation count)
            return await database_1.AppDataSource.getRepository(Career_1.Career).find({ take: 5 });
        },
        getUserStats: async (_, __, { user }) => {
            if (!user)
                throw new Error("Unauthorized");
            const answerRepo = database_1.AppDataSource.getRepository(Answer_1.Answer);
            const recommendationRepo = database_1.AppDataSource.getRepository(Recommendation_1.Recommendation);
            const userRepo = database_1.AppDataSource.getRepository(User_1.User);
            const [answerCount, careerMatches, dbUser] = await Promise.all([
                answerRepo.count({ where: { user: { id: user.id } } }),
                recommendationRepo.count({ where: { user: { id: user.id } } }),
                userRepo.findOneBy({ id: user.id }),
            ]);
            return {
                // Each assessment submits all answers at once; if any answers exist, assessment was done
                totalAssessments: answerCount > 0 ? 1 : 0,
                careerMatches,
                memberSince: dbUser?.created_at
                    ? new Date(dbUser.created_at).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                    })
                    : "Recently",
                hasCompletedAssessment: answerCount > 0,
            };
        },
    },
    Mutation: {
        createCareer: async (_, args, { user }) => {
            if (!user || user.role !== "admin")
                throw new Error("Unauthorized");
            const careerRepository = database_1.AppDataSource.getRepository(Career_1.Career);
            const career = careerRepository.create(args);
            return await careerRepository.save(career);
        },
        updateCareer: async (_, { id, ...args }, { user }) => {
            if (!user || user.role !== "admin")
                throw new Error("Unauthorized");
            const careerRepository = database_1.AppDataSource.getRepository(Career_1.Career);
            await careerRepository.update(id, args);
            return await careerRepository.findOneBy({ id });
        },
        deleteCareer: async (_, { id }, { user }) => {
            if (!user || user.role !== "admin")
                throw new Error("Unauthorized");
            await database_1.AppDataSource.getRepository(Career_1.Career).delete(id);
            return true;
        },
        generateCareerRecommendation: async (_, __, { user }) => {
            if (!user)
                throw new Error("Unauthorized");
            const answerRepo = database_1.AppDataSource.getRepository(Answer_1.Answer);
            const userAnswers = await answerRepo.find({
                where: { user: { id: user.id } },
                relations: ["question"],
            });
            if (userAnswers.length === 0)
                throw new Error("Please complete the assessment first");
            const profile = {
                interests: userAnswers
                    .filter((a) => a.question.category === "interests")
                    .map((a) => a.answer),
                skills: userAnswers
                    .filter((a) => a.question.category === "skills")
                    .map((a) => a.answer),
                education: userAnswers.find((a) => a.question.category === "education")?.answer ||
                    "Student",
            };
            // Only generate AI response – do NOT auto-save; user saves individually
            return await (0, aiService_1.getAIRecommendations)(profile);
        },
        saveAIRecommendation: async (_, args, { user }) => {
            if (!user)
                throw new Error("Unauthorized");
            const aiRecRepo = database_1.AppDataSource.getRepository(AIRecommendation_1.AIRecommendation);
            // Avoid duplicate saves for the same title
            const existing = await aiRecRepo.findOne({
                where: { user: { id: user.id }, title: args.title },
            });
            if (existing)
                throw new Error("Already saved");
            const rec = aiRecRepo.create({
                user: { id: user.id },
                title: args.title,
                explanation: args.explanation,
                requiredSkills: args.requiredSkills,
                salaryRange: args.salaryRange,
                roadmap: args.roadmap,
            });
            return await aiRecRepo.save(rec);
        },
        deleteSavedAIRecommendation: async (_, { id }, { user }) => {
            if (!user)
                throw new Error("Unauthorized");
            const aiRecRepo = database_1.AppDataSource.getRepository(AIRecommendation_1.AIRecommendation);
            await aiRecRepo.delete({ id, user: { id: user.id } });
            return true;
        },
    },
};
