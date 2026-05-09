const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api/backend";

export async function saveAttempt(
  token: string,
  payload: {
    question?: string;
    user_answer?: string;
    corrected_answer?: string;
    accuracy_score?: number;
    vocabulary_score?: number;
    verb_score?: number;
    confidence_score?: number;
    xp_earned?: number;
    duration_seconds?: number;
  }
) {
  const res = await fetch(
    `${API_BASE_URL}/reports/save-attempt`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        exercise_type: "verbs",

        ...payload,
      }),
    }
  );

  if (!res.ok) {
    const err = await res.json();

    throw new Error(
      err?.detail || "Failed to save attempt"
    );
  }

  return res.json();
}