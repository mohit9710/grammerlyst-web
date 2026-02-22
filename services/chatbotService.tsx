/**
 * Chatbot Service
 * Handles communication with the FastAPI Sentence Correction backend.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000";

export interface CorrectionResponse {
  original: string;
  fixed: string;
  rule: string;
}

export interface RoleplayMessage {
  reply: string;
  correction: {
    fixed: string | null;
    explanation: string | null;
  } | null;
}

export const chatbotService = {
  /**
   * Sends a sentence to the backend for correction.
   * Includes the access token from localStorage for authentication.
   */
  async correctSentence(sentence: string): Promise<CorrectionResponse> {
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

    if (!token) {
      throw new Error("Authentication required. Please log in.");
    }

    try {
      const response = await fetch(`${API_BASE_URL}/sentence/correct`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ sentence }),
      });

      if (!response.ok) {
        // Handle specific status codes if needed
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to process sentence.");
      }

      const data: CorrectionResponse = await response.json();
      return data;
    } catch (error) {
      console.error("ChatbotService Error:", error);
      throw error;
    }
  }, 

  async sendRoleplay(role_title: string, user_input: string) {
    const token = localStorage.getItem("access_token");
    const response = await fetch(`${API_BASE_URL}/sentence/roleplay`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ role_title, user_input }),
    });

    if (!response.ok) throw new Error("Failed to get response");
    return response.json();
  }
};