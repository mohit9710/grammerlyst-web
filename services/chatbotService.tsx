/**
 * Chatbot Service
 * Handles communication with the FastAPI backend.
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "/api/backend";

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
 * ✅ Safe token getter (SSR safe)
 */
function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}

/**
 * 🔥 Generate or reuse session id (Safari safe)
 */
function getRoleplaySessionId(): string {
  if (typeof window === "undefined") return "";

  let sessionId = localStorage.getItem("roleplay_session_id");

  if (!sessionId) {
    // ✅ crypto fallback for older browsers
    sessionId =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : Math.random().toString(36).substring(2) +
          Date.now().toString(36);

    localStorage.setItem("roleplay_session_id", sessionId);
  }

  return sessionId;
}

/**
 * ✅ Safe JSON parser
 */
async function safeJson(res: Response) {
  try {
    return await res.json();
  } catch {
    return {};
  }
}

export const chatbotService = {
  /**
   * Sentence correction
   */
  async correctSentence(sentence: string): Promise<CorrectionResponse> {
    const token = getAccessToken();

    if (!token) {
      throw new Error("Authentication required. Please log in.");
    }

    let response: Response;

    try {
      response = await fetch(`${API_BASE_URL}/sentence/correct`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ sentence }),
      });
    } catch {
      throw new Error("Network error. Please try again.");
    }

    const data = await safeJson(response);

    if (!response.ok) {
      throw new Error(data?.detail || "Failed to process sentence.");
    }

    return data;
  },

  /**
   * 🔥 Roleplay chat
   */
  async sendRoleplay(
    role_title: string,
    user_input: string
  ): Promise<RoleplayMessage> {
    const token = getAccessToken();

    if (!token) {
      throw new Error("Authentication required. Please log in.");
    }

    const session_id = getRoleplaySessionId();

    let response: Response;

    try {
      response = await fetch(`${API_BASE_URL}/sentence/roleplay`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          role_title,
          user_input,
          session_id,
        }),
      });
    } catch {
      throw new Error("Network error. Please try again.");
    }

    const data = await safeJson(response);

    // ✅ better error handling
    if (!response.ok) {
      if (response.status === 403) {
        throw new Error(data?.detail || "Daily limit reached.");
      }
      throw new Error(data?.detail || "Failed to get response");
    }

    return data;
  },

  /**
   * 🔥 Reset session (call when chat ends)
   */
  resetRoleplaySession() {
    if (typeof window === "undefined") return;
    localStorage.removeItem("roleplay_session_id");
  },
};