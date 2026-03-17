// ─── Auth / User ─────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  created_at: string;
}

// ─── Career ──────────────────────────────────────────────────────────────────

export interface Career {
  id: string;
  title: string;
  description: string;
  skills_required: string[];
  salary_range: string;
  growth_rate: string;
}

/** Shape returned by generateCareerRecommendation */
export interface CareerRecommendation {
  title: string;
  explanation: string;
  requiredSkills: string[];
  salaryRange: string;
  roadmap: string[];
}

// ─── Assessment ──────────────────────────────────────────────────────────────

export interface AssessmentQuestion {
  id: string;
  question: string;
  category: string;
}

export interface AssessmentAnswer {
  question_id: string;
  answer: string;
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

export interface UserDashboardEntry {
  id: string;
  score: number;
  career: Career;
}

export interface UserStats {
  totalAssessments: number;
  careerMatches: number;
  memberSince: string;
  hasCompletedAssessment: boolean;
}

// ─── Admin ───────────────────────────────────────────────────────────────────

export interface AdminCareer {
  id: string;
  title: string;
}

export interface AdminQuestion {
  id: string;
}
