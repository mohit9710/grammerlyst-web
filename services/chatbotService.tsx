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
  usage?: {
    used: number;
    limit: number | "unlimited";
    remaining: number | "unlimited";
  };
}

/**
 * ✅ Safe token getter (SSR safe)
 */
function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
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
   * 🔥 Roleplay chat (UPDATED - NO SESSION ID)
   */
  async sendRoleplay(
    role_title: string,
    user_input: string
  ): Promise<RoleplayMessage> {
    const token = getAccessToken();

    if (!token) {
      throw new Error("Authentication required. Please log in.");
    }

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
        }),
      });
    } catch {
      throw new Error("Network error. Please try again.");
    }

    const data = await safeJson(response);

    // ✅ Better error handling
    if (!response.ok) {
      if (response.status === 403) {
        if (data?.detail === "DAILY_LIMIT_REACHED") {
          throw new Error("You’ve reached your daily limit.");
        }
        if (data?.detail === "SESSION_LIMIT_REACHED") {
          throw new Error("Session limit reached.");
        }
        throw new Error(data?.detail || "Access denied.");
      }

      throw new Error(data?.detail || "Failed to get response");
    }

    return data;
  },
};