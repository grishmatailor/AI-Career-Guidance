import { gql } from "@apollo/client";

export const REGISTER_USER = gql`
  mutation RegisterUser($name: String!, $email: String!, $password: String!) {
    registerUser(name: $name, email: $email, password: $password) {
      token
      user {
        id
        name
        role
      }
    }
  }
`;

export const LOGIN_USER = gql`
  mutation LoginUser($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      token
      user {
        id
        name
        role
      }
    }
  }
`;

export const SUBMIT_ASSESSMENT = gql`
  mutation SubmitAssessment($answers: [SubmitAnswerInput!]!) {
    submitAssessment(answers: $answers)
  }
`;

export const GENERATE_RECOMMENDATION = gql`
  mutation GenerateRecommendation {
    generateCareerRecommendation {
      careers {
        title
        explanation
        requiredSkills
        salaryRange
        roadmap
      }
    }
  }
`;

export const SAVE_AI_RECOMMENDATION = gql`
  mutation SaveAIRecommendation(
    $title: String!
    $explanation: String!
    $requiredSkills: [String!]!
    $salaryRange: String!
    $roadmap: [String!]!
  ) {
    saveAIRecommendation(
      title: $title
      explanation: $explanation
      requiredSkills: $requiredSkills
      salaryRange: $salaryRange
      roadmap: $roadmap
    ) {
      id
      title
      created_at
    }
  }
`;

export const DELETE_SAVED_AI_RECOMMENDATION = gql`
  mutation DeleteSavedAIRecommendation($id: ID!) {
    deleteSavedAIRecommendation(id: $id)
  }
`;

export const SAVE_CAREER = gql`
  mutation SaveCareer($careerId: ID!) {
    saveCareer(careerId: $careerId) {
      id
    }
  }
`;

export const CHAT_CAREER = gql`
  mutation ChatCareer($message: String!) {
    chatCareer(message: $message)
  }
`;
