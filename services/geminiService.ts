import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function analyzeImage(imageBase64: string): Promise<any> {
  // Strip the data URL prefix if present (e.g., "data:image/jpeg;base64,")
  const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");

  const prompt = `
    Analyze this injury image for immediate triage. 
    Provide a JSON response with:
    - severity: Integer (1=Minor, 2=Moderate, 3=Severe, 4=Critical)
    - title: Short medical name of injury (e.g., "Second-degree Burn", "Deep Laceration")
    - description: A clear, non-technical description of what is visible.
    - firstAidSteps: Array of 3-5 clear, actionable first aid steps.
    - confidence: Number between 0 and 1.
    - urgencyMessage: Short message (e.g., "Wash and monitor", "Go to ER immediately").
    - recommendation: One of "HOME_CARE", "DOCTOR", "ER", "911".
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Data
            }
          },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            severity: { type: Type.INTEGER },
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            firstAidSteps: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            confidence: { type: Type.NUMBER },
            urgencyMessage: { type: Type.STRING },
            recommendation: { 
              type: Type.STRING, 
              enum: ["HOME_CARE", "DOCTOR", "ER", "911"] 
            }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    throw new Error("No response text");
  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    throw error;
  }
}