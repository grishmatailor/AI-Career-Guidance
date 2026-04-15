"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDefs = void 0;
exports.typeDefs = `#graphql
  type User {
    id: ID!
    name: String!
    email: String!
    role: String!
    education: String
    created_at: String!
  }

  type Question {
    id: ID!
    question: String!
    category: String!
  }

  type Answer {
    id: ID!
    user: User!
    question: Question!
    answer: String!
  }



  type UserStats {
    totalAssessments: Int!
    careerMatches: Int!
    memberSince: String!
    hasCompletedAssessment: Boolean!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type AICareer {
    title: String!
    explanation: String!
    requiredSkills: [String!]!
    salaryRange: String!
    roadmap: [String!]!
  }

  type AIRecommendationResponse {
    careers: [AICareer!]!
  }

  type SavedAIRecommendation {
    id: ID!
    title: String!
    explanation: String!
    requiredSkills: [String!]!
    salaryRange: String!
    roadmap: [String!]!
    created_at: String!
  }

  input SubmitAnswerInput {
    question_id: ID!
    answer: String!
  }

  type Query {
    getQuestions: [Question!]!
    getSavedAIRecommendations: [SavedAIRecommendation!]!
    getAllUsers: [User!]!
    getUserStats: UserStats!
    me: User
  }

  type Mutation {
    registerUser(name: String!, email: String!, password: String!, role: String): AuthPayload!
    loginUser(email: String!, password: String!): AuthPayload!
    submitAssessment(answers: [SubmitAnswerInput!]!): Boolean!
    generateCareerRecommendation: AIRecommendationResponse!
    saveAIRecommendation(
      title: String!
      explanation: String!
      requiredSkills: [String!]!
      salaryRange: String!
      roadmap: [String!]!
    ): SavedAIRecommendation!
    deleteSavedAIRecommendation(id: ID!): Boolean!
    
    createQuestion(question: String!, category: String!): Question!
    updateQuestion(id: ID!, question: String, category: String): Question!
    deleteQuestion(id: ID!): Boolean!
    
    # Chatbot
    chatCareer(message: String!): String!
  }
`;
