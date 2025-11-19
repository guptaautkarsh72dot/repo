import { GoogleGenAI } from "@google/genai";
import { Difficulty, GuessRecord, GuessStatus } from "../types";

// Initialize the Gemini API client
// The API key is assumed to be available in process.env.API_KEY
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateGameCommentary = async (
  currentGuess: number,
  targetNumber: number,
  status: GuessStatus,
  history: GuessRecord[],
  difficulty: Difficulty
): Promise<{ text: string; emotion: string }> => {
  if (!apiKey) {
    return { 
      text: "I need an API Key to speak! (Check process.env.API_KEY)", 
      emotion: "neutral" 
    };
  }

  const modelId = 'gemini-2.5-flash';
  
  const prompt = `
    You are "Gemini", a witty, slightly sarcastic, but ultimately helpful game show host for a Number Guessing Game.
    
    Context:
    - Difficulty: ${difficulty}
    - The Secret Number is: ${targetNumber}
    - User just guessed: ${currentGuess}
    - Result: ${status}
    - Previous guesses count: ${history.length}
    
    Task:
    Generate a short, 1-sentence reaction to the user's guess.
    - If they are WAY off, roast them gently.
    - If they are close, encourage them (or tease them about being *almost* there).
    - If they won, celebrate enthusiastically.
    - If they lost (ran out of turns), offer condolences mixed with a "better luck next time".
    
    Output Format:
    Return ONLY a JSON object with two fields:
    1. "text": The message string.
    2. "emotion": One of ["neutral", "happy", "sarcastic", "surprised", "thinking"].
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No response from AI");

    return JSON.parse(jsonText);

  } catch (error) {
    console.error("AI Generation Error:", error);
    return {
      text: status === GuessStatus.CORRECT ? "You got it! Well done!" : "Interesting guess...",
      emotion: "neutral"
    };
  }
};

export const generateHint = async (
  targetNumber: number,
  history: GuessRecord[]
): Promise<string> => {
  if (!apiKey) return "I can't give hints without an API Key.";

  const modelId = 'gemini-2.5-flash';
  
  const prompt = `
    The secret number is ${targetNumber}.
    The user has guessed: ${history.map(h => h.value).join(', ')}.
    
    Give a helpful but cryptic mathematical or logical hint about the number. 
    Do NOT reveal the number directly. 
    Keep it under 15 words.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
    });
    return response.text || "Try guessing a number closer to the target!";
  } catch (error) {
    return "Focus on the feedback from your previous guesses.";
  }
};
