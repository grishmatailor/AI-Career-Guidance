import { gql } from "@apollo/client";

export const GET_QUESTIONS = gql`
  query GetQuestions {
    getQuestions {
      id
      question
      category
    }
  }
`;

export const GET_USER_STATS = gql`
  query GetUserStats {
    getUserStats {
      totalAssessments
      careerMatches
      memberSince
      hasCompletedAssessment
    }
  }
`;

export const ME = gql`
  query Me {
    me {
      id
      name
      email
      role
      created_at
    }
  }
`;

export const GET_SAVED_AI_RECOMMENDATIONS = gql`
  query GetSavedAIRecommendations {
    getSavedAIRecommendations {
      id
      title
      explanation
      requiredSkills
      salaryRange
      roadmap
      created_at
    }
  }
`;
