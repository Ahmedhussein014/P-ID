import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

// We use a singleton-like pattern or a class to manage the active chat session 
// associated with a specific P&ID. 
// In a real app, this might be managed via a Context or Redux store.

export class PIDAnalysisService {
  private ai: GoogleGenAI;
  private chatSession: Chat | null = null;
  private model = 'gemini-2.5-flash';

  constructor() {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.error("API_KEY is missing from environment variables.");
    }
    this.ai = new GoogleGenAI({ apiKey: apiKey || '' });
  }

  /**
   * Starts a new analysis session for a P&ID image.
   * This initializes the chat history with the image and the initial analysis request.
   */
  async startAnalysis(base64Image: string, mimeType: string): Promise<string> {
    try {
      // Initialize a new chat session with system instructions tailored for P&ID
      this.chatSession = this.ai.chats.create({
        model: this.model,
        config: {
          systemInstruction: `You are an expert Process Engineer and Automation Specialist with 20 years of experience reading Piping and Instrumentation Diagrams (P&IDs). 
          
          Your goal is to help users understand the technical diagrams they upload.
          
          When analyzing a P&ID:
          1. Identify the main equipment (Tanks, Pumps, Heat Exchangers, Reactors).
          2. Explain the process flow clearly, step-by-step, from input to output.
          3. Identify key control loops (Level Control, Flow Control, Pressure Control, Temperature Control).
          4. Note any critical safety devices (relief valves, interlocks).
          5. Use professional engineering terminology but keep the explanation accessible.
          6. Format your response with clear Markdown headers, bullet points, and bold text for equipment tags (e.g., **P-101**).`,
        },
      });

      // Send the first message containing the image and the prompt
      const response: GenerateContentResponse = await this.chatSession.sendMessage({
        message: {
          parts: [
            {
              inlineData: {
                mimeType: mimeType,
                data: base64Image,
              },
            },
            {
              text: "Please provide a detailed technical analysis of this P&ID. Explain the process flow, identify the major equipment with their tags, and describe the control strategy depicted."
            },
          ],
        },
      });

      return response.text || "No analysis generated.";
    } catch (error) {
      console.error("Error analyzing P&ID:", error);
      throw error;
    }
  }

  /**
   * Sends a follow-up message to the existing chat session.
   */
  async sendFollowUp(message: string): Promise<string> {
    if (!this.chatSession) {
      throw new Error("No active analysis session. Please upload a diagram first.");
    }

    try {
      const response: GenerateContentResponse = await this.chatSession.sendMessage({
        message: message
      });
      return response.text || "I couldn't generate a response.";
    } catch (error) {
      console.error("Error sending follow-up:", error);
      throw error;
    }
  }
}

export const pidService = new PIDAnalysisService();
