import { AppDataSource } from "../config/database";
import { Question } from "../entities/Question";
import { Answer } from "../entities/Answer";
import { User } from "../entities/User";

export const questionResolvers = {
  Query: {
    getQuestions: async () => {
      return await AppDataSource.getRepository(Question).find();
    },
  },
  Mutation: {
    createQuestion: async (_: any, args: any, { user }: any) => {
      if (!user || user.role !== "admin") throw new Error("Unauthorized");
      const questionRepository = AppDataSource.getRepository(Question);
      const question = questionRepository.create(args);
      return await questionRepository.save(question);
    },
    updateQuestion: async (_: any, { id, ...args }: any, { user }: any) => {
      if (!user || user.role !== "admin") throw new Error("Unauthorized");
      const questionRepository = AppDataSource.getRepository(Question);
      await questionRepository.update(id, args);
      return await questionRepository.findOneBy({ id });
    },
    deleteQuestion: async (_: any, { id }: any, { user }: any) => {
      if (!user || user.role !== "admin") throw new Error("Unauthorized");
      await AppDataSource.getRepository(Question).delete(id);
      return true;
    },
    submitAssessment: async (_: any, { answers }: any, { user }: any) => {
      if (!user) throw new Error("Unauthorized");
      const answerRepo = AppDataSource.getRepository(Answer);
      const userRepo = AppDataSource.getRepository(User);
      
      // Clear old answers
      await answerRepo.delete({ user: { id: user.id } });

      // Increment assessment count
      await userRepo.increment({ id: user.id }, "assessmentCount", 1);

      const answerEntities = answers.map((a: any) => 
        answerRepo.create({
          user: { id: user.id } as User,
          question: { id: a.question_id } as Question,
          answer: a.answer
        })
      );

      await answerRepo.save(answerEntities);
      return true;
    },
  },
};
