import { AppDataSource } from "../config/database";
import { AIRecommendation } from "../entities/AIRecommendation";
import { User } from "../entities/User";
import { Answer } from "../entities/Answer";
import { getAIRecommendations } from "../services/aiService";

export const careerResolvers = {
  Query: {
    getSavedAIRecommendations: async (_: unknown, __: unknown, { user }: { user: User }) => {
      if (!user) throw new Error("Unauthorized");
      return await AppDataSource.getRepository(AIRecommendation).find({
        where: { user: { id: user.id } },
        order: { created_at: "DESC" },
      });
    },
    getUserStats: async (_: unknown, __: unknown, { user }: { user: User }) => {
      if (!user) throw new Error("Unauthorized");

      const aiRecRepo = AppDataSource.getRepository(AIRecommendation);
      const userRepo = AppDataSource.getRepository(User);

      const [aiRecommendations, dbUser] = await Promise.all([
        aiRecRepo.count({ where: { user: { id: user.id } } }),
        userRepo.findOneBy({ id: user.id }),
      ]);

      return {
        totalAssessments: dbUser?.assessmentCount ?? 0,
        careerMatches: aiRecommendations,
        memberSince: dbUser?.created_at
          ? new Date(dbUser.created_at).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })
          : "Recently",
        hasCompletedAssessment: (dbUser?.assessmentCount ?? 0) > 0,
      };
    },
  },
  Mutation: {
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

