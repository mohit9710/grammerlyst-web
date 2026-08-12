const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "/api/backend";

// ======================================================
// TYPES
// ======================================================

export interface WritingPrompt {
  id: number;

  title: string;

  prompt_text: string;

  category: string;

  difficulty: string;

  min_words: number;
}

export interface WritingSubmitPayload {
  content: string;

  title?: string;

  prompt_id?: number;

  save?: boolean;
}

export interface WritingAnalysis {
  overall_score: number;

  grammar_score: number;

  vocabulary_score: number;

  clarity_score: number;

  coherence_score: number;

  feedback: string;

  mistakes: string[];

  improvements: string[];

  strengths: string[];

  corrected_text: string;
}

export interface WritingSubmitResponse {
  submission_id: number | null;

  saved: boolean;

  analysis: WritingAnalysis;
}

export interface WritingHistoryItem {
  id: number;

  title: string | null;

  overall_score: number;

  grammar_score: number;

  vocabulary_score: number;

  clarity_score: number;

  coherence_score: number;

  word_count: number;

  created_at: string;
}

export interface WritingSubmission {
  id: number;

  prompt_id: number | null;

  title: string | null;

  content: string;

  word_count: number;

  corrected_text: string | null;

  overall_score: number;

  grammar_score: number;

  vocabulary_score: number;

  clarity_score: number;

  coherence_score: number;

  feedback: string | null;

  mistakes: string[];

  improvements: string[];

  strengths: string[];

  created_at: string;
}

export interface ScoreHistoryPoint {
  date: string;

  overall_score: number;
}

export interface WritingProgress {
  total_submissions: number;

  average_score: number;

  best_score: number;

  latest_score: number;

  trend: string;

  trend_delta: number;

  skill_breakdown: Record<string, unknown>;

  score_history: ScoreHistoryPoint[];
}

// ======================================================
// COMMON HEADERS
// ======================================================

const getHeaders = () => {
  const token =
    localStorage.getItem("access_token");

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

// ======================================================
// GET PROMPTS
// ======================================================

export const fetchWritingPrompts =
  async (params?: {
    difficulty?: string;
    category?: string;
  }): Promise<WritingPrompt[]> => {
    const query = new URLSearchParams();

    if (params?.difficulty)
      query.set(
        "difficulty",
        params.difficulty
      );

    if (params?.category)
      query.set(
        "category",
        params.category
      );

    const qs = query.toString();

    const res = await fetch(
      `${API_BASE_URL}/writing/prompts${
        qs ? `?${qs}` : ""
      }`,
      {
        method: "GET",
        headers: getHeaders(),
      }
    );

    if (!res.ok) {
      throw new Error(
        "Failed to fetch writing prompts"
      );
    }

    return await res.json();
  };

// ======================================================
// GET RANDOM PROMPT
// ======================================================

export const fetchRandomWritingPrompt =
  async (
    difficulty?: string
  ): Promise<WritingPrompt> => {
    const qs = difficulty
      ? `?difficulty=${encodeURIComponent(
          difficulty
        )}`
      : "";

    const res = await fetch(
      `${API_BASE_URL}/writing/prompts/random${qs}`,
      {
        method: "GET",
        headers: getHeaders(),
      }
    );

    if (!res.ok) {
      throw new Error(
        "Failed to fetch a writing prompt"
      );
    }

    return await res.json();
  };

// ======================================================
// SUBMIT WRITING
// ======================================================

export const submitWriting = async (
  payload: WritingSubmitPayload
): Promise<WritingSubmitResponse> => {
  const res = await fetch(
    `${API_BASE_URL}/writing/submit`,
    {
      method: "POST",

      headers: getHeaders(),

      body: JSON.stringify({
        save: true,
        ...payload,
      }),
    }
  );

  if (!res.ok) {
    const err = await res
      .json()
      .catch(() => null);

    throw new Error(
      err?.detail ||
        "Failed to submit writing"
    );
  }

  return await res.json();
};

// ======================================================
// GET HISTORY
// ======================================================

export const fetchWritingHistory =
  async (params?: {
    limit?: number;
    offset?: number;
  }): Promise<WritingHistoryItem[]> => {
    const query = new URLSearchParams();

    if (params?.limit !== undefined)
      query.set(
        "limit",
        String(params.limit)
      );

    if (params?.offset !== undefined)
      query.set(
        "offset",
        String(params.offset)
      );

    const qs = query.toString();

    const res = await fetch(
      `${API_BASE_URL}/writing/history${
        qs ? `?${qs}` : ""
      }`,
      {
        method: "GET",
        headers: getHeaders(),
      }
    );

    if (!res.ok) {
      throw new Error(
        "Failed to fetch writing history"
      );
    }

    return await res.json();
  };

// ======================================================
// GET SINGLE SUBMISSION
// ======================================================

export const fetchWritingSubmission =
  async (
    submissionId: number
  ): Promise<WritingSubmission> => {
    const res = await fetch(
      `${API_BASE_URL}/writing/submission/${submissionId}`,
      {
        method: "GET",
        headers: getHeaders(),
      }
    );

    if (!res.ok) {
      throw new Error(
        "Failed to fetch submission"
      );
    }

    return await res.json();
  };

// ======================================================
// GET PROGRESS
// ======================================================

export const fetchWritingProgress =
  async (): Promise<WritingProgress> => {
    const res = await fetch(
      `${API_BASE_URL}/writing/progress`,
      {
        method: "GET",
        headers: getHeaders(),
      }
    );

    if (!res.ok) {
      throw new Error(
        "Failed to fetch progress"
      );
    }

    return await res.json();
  };
