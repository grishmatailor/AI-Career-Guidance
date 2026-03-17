import { userResolvers } from "./userResolvers";
import { careerResolvers } from "./careerResolvers";
import { questionResolvers } from "./questionResolvers";

export const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...careerResolvers.Query,
    ...questionResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...careerResolvers.Mutation,
    ...questionResolvers.Mutation,
  },
};
