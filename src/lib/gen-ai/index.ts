import 'server-only';

import { GenerativeModel, GoogleGenerativeAI } from '@google/generative-ai';

export const genAi = (): GenerativeModel => {
  if (!process.env.GEMINI_AI_API_KEY) {
    throw new Error(`Gemini AI API key required`);
  }

  const genAI: GoogleGenerativeAI = new GoogleGenerativeAI(
    process.env.GEMINI_AI_API_KEY,
  );

  const model: GenerativeModel = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
      candidateCount: 1,
      maxOutputTokens: 20,
    },
  });

  return model;
};
