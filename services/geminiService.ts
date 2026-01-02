
import { GoogleGenAI, Type } from "@google/genai";
import { GeminiAnalysis } from "../types";

export const analyzeIncident = async (text: string): Promise<GeminiAnalysis> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze this disaster report: "${text}". Return a structured assessment.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          type: {
            type: Type.STRING,
            description: "The nature of the disaster (e.g., Flood, Fire, Earthquake).",
          },
          severity_score: {
            type: Type.NUMBER,
            description: "A score from 1 to 10 evaluating the scale of impact.",
          },
          urgency: {
            type: Type.STRING,
            description: "Categorical urgency: High, Med, or Low.",
          },
          suggested_action: {
            type: Type.STRING,
            description: "Immediate recommended action for responders.",
          },
        },
        required: ["type", "severity_score", "urgency", "suggested_action"],
      },
    },
  });

  try {
    const result = JSON.parse(response.text);
    return result as GeminiAnalysis;
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    throw new Error("AI analysis failed to return valid JSON");
  }
};
