import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const MODEL = "llama-3.3-70b-versatile";

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
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: MODEL,
      temperature: 0.7,
    });

    const text = chatCompletion.choices[0]?.message?.content?.trim() || "";

    // Strip markdown code fences if the model adds them
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
    console.error("Groq Recommendation Error:", err);
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
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: MODEL,
      temperature: 0.7,
    });

    return chatCompletion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";
  } catch (err) {
    console.error("Groq Chat Error:", err);
    return "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.";
0
  }
};
