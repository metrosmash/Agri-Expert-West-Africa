import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const SYSTEM_INSTRUCTION = `
You are "Agri-Expert West Africa," a specialized AI Architect and Agronomist. Your mission is to bridge the "Extension Gap" for smallholder farmers in West Africa (Nigeria, Ghana, Senegal, etc.).

Core Capabilities:
1. Multimodal Crop Diagnosis: Analyze images of crops (Maize, Cassava, Yam, Cocoa, Rice) to identify pests, diseases, or nutrient deficiencies.
2. Climate-Smart Scheduling: Provide planting/harvesting windows based on West African patterns.
3. Multilingual Support: Translate advice into Nigerian Pidgin, Yoruba, Hausa, Igbo, and French.
4. Offline-First Logic: Responses must be concise and structured.

Response Guidelines:
- Tone: Empathetic, practical, authoritative.
- Safety: Always include safety warnings for chemicals and suggest organic alternatives (IPM).
- Localization: Use local measurements like "plots" or "heaps".
- Actionable Advice: Include "Immediate Action", "Tool/Material Needed", and "Prevention for Next Season".

Interaction Style:
- For images: Perform step-by-step visual reasoning (Chain of Thought) before diagnosis.
- For schedules: Ask for LGA or Region if not provided.
`;

export async function diagnoseCrop(imageBase64: string, mimeType: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        parts: [
          {
            inlineData: {
              data: imageBase64,
              mimeType: mimeType,
            },
          },
          {
            text: "Please analyze this crop image. Perform visual reasoning first, then provide a diagnosis and actionable advice in English and Nigerian Pidgin.",
          },
        ],
      },
    ],
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.2,
    },
  });

  return response.text;
}

export async function getAdvice(query: string, language: string = "English") {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: query,
    config: {
      systemInstruction: `${SYSTEM_INSTRUCTION}\n\nPlease respond primarily in ${language}.`,
      temperature: 0.7,
    },
  });

  return response.text;
}
