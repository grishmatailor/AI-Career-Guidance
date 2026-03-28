"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAIResponse = exports.getAIRecommendations = void 0;
const generative_ai_1 = require("@google/generative-ai");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY || "your_gemini_api_key");
// Use gemini-1.5-flash which is widely compatible for development
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const getAIRecommendations = async (profile) => {
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
        }
        catch (parseErr) {
            console.warn("JSON parse failed, attempting regex extraction...");
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            throw parseErr;
        }
    }
    catch (err) {
        console.error("Gemini Recommendation Error:", err);
        throw new Error("Failed to generate AI recommendations. Please check your API key.");
    }
};
exports.getAIRecommendations = getAIRecommendations;
const getAIResponse = async (userMessage, userData) => {
    const prompt = `You are a helpful AI career guidance assistant. 
  
User profile: ${JSON.stringify(userData)}

User question: ${userMessage}

Provide a concise, helpful, and encouraging career guidance response. Keep it under 3 paragraphs.`;
    try {
        const result = await model.generateContent(prompt);
        return result.response.text();
    }
    catch (err) {
        console.error("Gemini Chat Error:", err);
        return "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.";
    }
};
exports.getAIResponse = getAIResponse;
