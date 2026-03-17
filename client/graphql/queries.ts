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

export const GET_USER_DASHBOARD = gql`
  query GetUserDashboard {
    getUserDashboard {
      id
      score
      career {
        id
        title
        description
        salary_range
        skills_required
        growth_rate
      }
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

export const GET_CAREERS = gql`
  query GetCareers {
    getCareers {
      id
      title
      description
      skills_required
      salary_range
      growth_rate
    }
  }
`;

export const GET_CAREER_BY_ID = gql`
  query GetCareerById($id: ID!) {
    getCareerById(id: $id) {
      id
      title
      description
      skills_required
      salary_range
      growth_rate
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
