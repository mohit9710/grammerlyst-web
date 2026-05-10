const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "/api/backend";

// =====================================================
// TYPES
// =====================================================

interface SaveAttemptPayload {
  exercise_type: string;

  question?: string;

  user_answer?: string;

  corrected_answer?: string;

  ai_feedback?: string;

  accuracy_score?: number;

  grammar_score?: number;

  pronunciation_score?: number;

  fluency_score?: number;

  vocabulary_score?: number;

  listening_score?: number;

  verb_score?: number;

  confidence_score?: number;

  speaking_speed?: number;

  pause_count?: number;

  filler_word_count?: number;

  xp_earned?: number;

  duration_seconds?: number;
}

// =====================================================
// SAVE ATTEMPT
// =====================================================

export async function saveAttempt(
  token: string,
  payload: SaveAttemptPayload
) {
  const res = await fetch(
    `${API_BASE_URL}/reports/save-attempt`,
    {
      method: "POST",

      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    const err = await res.json();

    throw new Error(
      err?.detail ||
        "Failed to save attempt"
    );
  }

  return res.json();
}

// =====================================================
// FETCH PROFILE ANALYSIS
// =====================================================

export async function fetchProfileAnalysis(
  token: string
) {
  const res = await fetch(
    `${API_BASE_URL}/reports/analysis`,
    {
      method: "GET",

      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type":
          "application/json",
      },
    }
  );

  if (!res.ok) {
    const err = await res.json();

    throw new Error(
      err?.detail ||
        "Failed to fetch profile analysis"
    );
  }

  return res.json();
}

export async function fetchWeeklyReport(
  token: string
) {
  const res = await fetch(
    `${API_BASE_URL}/reports/weekly-report`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error(
      "Failed to fetch weekly report"
    );
  }

  return res.json();
}