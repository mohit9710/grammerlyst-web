/**
 * Chatbot Service
 * Handles communication with the FastAPI backend.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api/backend";

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

/**
 * 🔥 Generate or reuse session id
 */
function getRoleplaySessionId(): string {
  if (typeof window === "undefined") return "";

  let sessionId = localStorage.getItem("roleplay_session_id");

  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem("roleplay_session_id", sessionId);
  }

  return sessionId;
}

export const chatbotService = {
  /**
   * Sentence correction
   */
  async correctSentence(sentence: string): Promise<CorrectionResponse> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;

    if (!token) {
      throw new Error("Authentication required. Please log in.");
    }

    const response = await fetch(`${API_BASE_URL}/sentence/correct`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ sentence }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Failed to process sentence.");
    }

    return data;
  },

  /**
   * 🔥 Roleplay chat (FIXED)
   */
  async sendRoleplay(role_title: string, user_input: string): Promise<RoleplayMessage> {
    const token = localStorage.getItem("access_token");

    if (!token) {
      throw new Error("Authentication required. Please log in.");
    }

    const session_id = getRoleplaySessionId();

    const response = await fetch(`${API_BASE_URL}/sentence/roleplay`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        role_title,
        user_input,
        session_id, // ✅ REQUIRED
      }),
    });

    const data = await response.json();

    // 🔥 Better error handling
    if (!response.ok) {
      if (response.status === 403) {
        throw new Error(data.detail || "Daily limit reached.");
      }
      throw new Error(data.detail || "Failed to get response");
    }

    return data;
  },

  /**
   * 🔥 Reset session (call when chat ends)
   */
  resetRoleplaySession() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("roleplay_session_id");
    }
  },
};