const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api/backend";

// --- Interfaces ---

export interface GrammarLesson {
  id: number;
  topic_id: number;
  title: string;
  formula: string | null;
  example_sentence: string | null;
  content_body: string | null;
}

export interface GrammarTopic {
  id: number;
  title: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Native';
  display_order: number;
  lessons?: GrammarLesson[]; // Optional nested lessons
}

// --- Service Functions ---

/**
 * Fetches the list of all grammar topics (for the sidebar)
 */
export async function fetchGrammarTopics(token?: string): Promise<GrammarTopic[]> {
  const res = await fetch(`${API_BASE_URL}/grammar/topics`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.detail || "Failed to fetch grammar topics");
  }

  return (await res.json()) as GrammarTopic[];
}

/**
 * Fetches all lessons belonging to a specific topic (e.g., all "Verb Tenses")
 */
export async function fetchLessonsByTopic(
  topicId: number,
  token?: string
): Promise<GrammarLesson[]> {
  const res = await fetch(`${API_BASE_URL}/grammar/lessons/${topicId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.detail || "Failed to fetch lessons");
  }

  return (await res.json()) as GrammarLesson[];
}