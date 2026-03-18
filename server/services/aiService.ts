import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY || "your_gemini_api_key"
);

// Use gemini-1.5-flash which is widely compatible for development
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

interface UserProfile {
  interests: string[];
  skills: string[];
  education: string;
}

interface ChatUserData {
  name?: string;
  email?: string;
  education?: string;
}

export const getAIRecommendations = async (profile: UserProfile) => {
  const prompt = `You are a career guidance expert. Based on the following student profile, recommend the top 5 careers.

Student Profile:
- Interests: ${profile.interests.join(", ") || "Not specified"}
- Skills: ${profile.skills.join(", ") || "Not specified"}
- Education: ${profile.education || "Student"}

Respond ONLY with a valid JSON object in this exact format (no markdown, no code fences, just raw JSON):
{
  "careers": [
    {
      "title": "Career Title",
      "explanation": "Why this career suits the student",
      "requiredSkills": ["Skill 1", "Skill 2", "Skill 3"],
      "salaryRange": "$XX,000 - $XX,000 per year",
      "roadmap": ["Step 1", "Step 2", "Step 3", "Step 4"]
    }
  ]
}`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    // Strip markdown code fences if Gemini adds them
    const cleaned = text
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    // Try parsing; if failed, try extracting JSON from string
    try {
      return JSON.parse(cleaned);
    } catch (parseErr) {
      console.warn("JSON parse failed, attempting regex extraction...");
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw parseErr;
    }
  } catch (err) {
    console.error("Gemini Recommendation Error:", err);
    throw new Error("Failed to generate AI recommendations. Please check your API key.");
  }
};

export const getAIResponse = async (
  userMessage: string,
  userData: ChatUserData
) => {
  const prompt = `You are a helpful AI career guidance assistant. 
  
User profile: ${JSON.stringify(userData)}

User question: ${userMessage}

Provide a concise, helpful, and encouraging career guidance response. Keep it under 3 paragraphs.`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (err) {
    console.error("Gemini Chat Error:", err);
    return "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.";
  }
};
