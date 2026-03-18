import { AppDataSource } from "../config/database";
import { Career } from "../entities/Career";
import { Recommendation } from "../entities/Recommendation";
import { AIRecommendation } from "../entities/AIRecommendation";
import { User } from "../entities/User";
import { Answer } from "../entities/Answer";
import { getAIRecommendations } from "../services/aiService";



export const careerResolvers = {
  Query: {
    getCareers: async () => {
      return await AppDataSource.getRepository(Career).find();
    },
    getRecommendations: async (_: unknown, __: unknown, { user }: { user: User }) => {
      if (!user) throw new Error("Unauthorized");
      return await AppDataSource.getRepository(Recommendation).find({
        where: { user: { id: user.id } },
        relations: ["career"],
      });
    },
    getSavedAIRecommendations: async (_: unknown, __: unknown, { user }: { user: User }) => {
      if (!user) throw new Error("Unauthorized");
      return await AppDataSource.getRepository(AIRecommendation).find({
        where: { user: { id: user.id } },
        order: { created_at: "DESC" },
      });
    },
    getUserDashboard: async (_: unknown, __: unknown, { user }: { user: User }) => {
      if (!user) throw new Error("Unauthorized");
      return await AppDataSource.getRepository(Recommendation).find({
        where: { user: { id: user.id } },
        relations: ["career"],
      });
    },
    getPopularCareers: async () => {
      // Logic for popular careers (could be based on recommendation count)
      return await AppDataSource.getRepository(Career).find({ take: 5 });
    },
    getUserStats: async (_: unknown, __: unknown, { user }: { user: User }) => {
      if (!user) throw new Error("Unauthorized");

      const answerRepo = AppDataSource.getRepository(Answer);
      const recommendationRepo = AppDataSource.getRepository(Recommendation);
      const userRepo = AppDataSource.getRepository(User);

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
    createCareer: async (
      _: unknown,
      args: Partial<Career>,
      { user }: { user: User }
    ) => {
      if (!user || user.role !== "admin") throw new Error("Unauthorized");
      const careerRepository = AppDataSource.getRepository(Career);
      const career = careerRepository.create(args);
      return await careerRepository.save(career);
    },
    updateCareer: async (
      _: unknown,
      { id, ...args }: Partial<Career> & { id: string },
      { user }: { user: User }
    ) => {
      if (!user || user.role !== "admin") throw new Error("Unauthorized");
      const careerRepository = AppDataSource.getRepository(Career);
      await careerRepository.update(id, args);
      return await careerRepository.findOneBy({ id });
    },
    deleteCareer: async (
      _: unknown,
      { id }: { id: string },
      { user }: { user: User }
    ) => {
      if (!user || user.role !== "admin") throw new Error("Unauthorized");
      await AppDataSource.getRepository(Career).delete(id);
      return true;
    },
    generateCareerRecommendation: async (_: unknown, __: unknown, { user }: { user: User }) => {
      if (!user) throw new Error("Unauthorized");

      const answerRepo = AppDataSource.getRepository(Answer);
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
        education:
          userAnswers.find((a) => a.question.category === "education")?.answer ||
          "Student",
      };

      // Only generate AI response – do NOT auto-save; user saves individually
      return await getAIRecommendations(profile);
    },
    saveAIRecommendation: async (
      _: unknown,
      args: {
        title: string;
        explanation: string;
        requiredSkills: string[];
        salaryRange: string;
        roadmap: string[];
      },
      { user }: { user: User }
    ) => {
      if (!user) throw new Error("Unauthorized");

      const aiRecRepo = AppDataSource.getRepository(AIRecommendation);

      // Avoid duplicate saves for the same title
      const existing = await aiRecRepo.findOne({
        where: { user: { id: user.id }, title: args.title },
      });
      if (existing) throw new Error("Already saved");

      const rec = aiRecRepo.create({
        user: { id: user.id } as User,
        title: args.title,
        explanation: args.explanation,
        requiredSkills: args.requiredSkills,
        salaryRange: args.salaryRange,
        roadmap: args.roadmap,
      });
      return await aiRecRepo.save(rec);
    },
    deleteSavedAIRecommendation: async (
      _: unknown,
      { id }: { id: string },
      { user }: { user: User }
    ) => {
      if (!user) throw new Error("Unauthorized");
      const aiRecRepo = AppDataSource.getRepository(AIRecommendation);
      await aiRecRepo.delete({ id, user: { id: user.id } });
      return true;
    },
  },
};
