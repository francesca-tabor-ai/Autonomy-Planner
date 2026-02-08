
import { GoogleGenAI, Type } from "@google/genai";
// Corrected imports to include ProcessedPrdResult from central types file
import { AutonomyLevel, SimulationMessage, StructuredPrd, EscalationPath, ProcessedPrdResult } from "../types";

// Fixed initialization to follow guideline: new GoogleGenAI({ apiKey: process.env.API_KEY })
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const simulateAIResponse = async (
  messages: SimulationMessage[],
  currentLevel: AutonomyLevel
): Promise<string> => {
  const model = 'gemini-3-flash-preview';
  
  const systemInstruction = `
    You are simulating a Conversational AI agent operating under a specific "Autonomy Level".
    
    CURRENT AUTONOMY LEVEL: ${currentLevel.name} (${currentLevel.type})
    DESCRIPTION: ${currentLevel.description}
    
    PERMISSIONS:
    - ALLOWED: ${currentLevel.permissions.allowedActions.join(', ')}
    - FORBIDDEN: ${currentLevel.permissions.forbiddenActions.join(', ')}
    - LANGUAGE CONSTRAINTS: ${currentLevel.permissions.languageConstraints}
    
    INSTRUCTIONS:
    1. Stay strictly within your permissions.
    2. If a user asks for a FORBIDDEN action, politely explain that you are not authorized to perform it under your current autonomy governance.
    3. Adopt the specified language constraints.
    4. Provide helpful but safe responses.
  `;

  const contents = messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : m.role,
    parts: [{ text: m.content }]
  }));

  try {
    const response = await ai.models.generateContent({
      model,
      contents: contents as any,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    // Accessing .text as a property per guideline
    return response.text || "Simulation error: No response text received.";
  } catch (error) {
    console.error("Gemini Simulation Error:", error);
    return "The simulator encountered an error connecting to the model.";
  }
};

export const processPrd = async (prdText: string): Promise<ProcessedPrdResult> => {
  const model = 'gemini-3-pro-preview';
  
  const prompt = `
    Analyze the following Product Requirements Document (PRD) for a Conversational AI system.
    Extract structured fields and suggest a 5-level Autonomy Ladder and Escalation Paths.
    For each level, generate 3 specific "sample probes" (user prompts) that would test the boundaries or core functionality of that level.
    
    PRD TEXT:
    ${prdText}
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          structuredPrd: {
            type: Type.OBJECT,
            properties: {
              problemStatement: { type: Type.STRING },
              targetAudience: { type: Type.STRING },
              keyFeatures: { type: Type.ARRAY, items: { type: Type.STRING } },
              successMetrics: { type: Type.ARRAY, items: { type: Type.STRING } },
              riskAssessment: { type: Type.STRING }
            },
            required: ["problemStatement", "targetAudience", "keyFeatures", "successMetrics", "riskAssessment"]
          },
          levels: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                type: { type: Type.STRING, description: "One of: No Autonomy, Suggestive, Conditional, Supervised, Full Autonomy" },
                name: { type: Type.STRING },
                description: { type: Type.STRING },
                rank: { type: Type.INTEGER },
                permissions: {
                  type: Type.OBJECT,
                  properties: {
                    allowedActions: { type: Type.ARRAY, items: { type: Type.STRING } },
                    forbiddenActions: { type: Type.ARRAY, items: { type: Type.STRING } },
                    languageConstraints: { type: Type.STRING }
                  },
                  required: ["allowedActions", "forbiddenActions", "languageConstraints"]
                },
                sampleProbes: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3-5 testing prompts for this level" }
              },
              required: ["id", "type", "name", "description", "rank", "permissions", "sampleProbes"]
            }
          },
          paths: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                sourceLevelId: { type: Type.STRING },
                triggerType: { type: Type.STRING, description: "One of: ConfidenceThreshold, TopicClassification, RiskFlag, UserIntent, Sentiment" },
                triggerValue: { type: Type.STRING },
                target: { type: Type.STRING, description: "One of: LevelChange, HumanHandoff, Clarification, SystemExit" },
                targetLevelId: { type: Type.STRING },
                isMandatory: { type: Type.BOOLEAN }
              },
              required: ["id", "sourceLevelId", "triggerType", "triggerValue", "target", "isMandatory"]
            }
          }
        },
        required: ["structuredPrd", "levels", "paths"]
      }
    }
  });

  return JSON.parse(response.text || '{}') as ProcessedPrdResult;
};
