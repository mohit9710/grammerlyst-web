const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "/api/backend";

// ======================================================
// TYPES
// ======================================================

export interface ListeningAudio {
  id: number;

  title: string;

  transcript: string;

  audio_url: string;

  thumbnail_url?: string;

  difficulty: string;

  category: string;

  accent: string;

  duration?: number;

  is_premium: boolean;

  is_active: boolean;

  slug?: string;

  created_at: string;
}

export interface SaveAttemptPayload {
  audio_id: number;

  user_answer: string;

  accuracy: number;

  play_count: number;

  accent_used: string;

  completed: boolean;
}

export interface ListeningProgress {
  total_attempts: number;

  average_accuracy: number;

  total_completed: number;

  current_streak: number;

  best_streak: number;
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
// GET ALL AUDIOS
// ======================================================

export const fetchListeningAudios =
  async (): Promise<ListeningAudio[]> => {
    const res = await fetch(
      `${API_BASE_URL}/listening/audios`,
      {
        method: "GET",
        headers: getHeaders(),
      }
    );

    if (!res.ok) {
      throw new Error(
        "Failed to fetch listening audios"
      );
    }

    return await res.json();
  };

// ======================================================
// GET SINGLE AUDIO
// ======================================================

export const fetchListeningAudio =
  async (
    audioId: number
  ): Promise<ListeningAudio> => {
    const res = await fetch(
      `${API_BASE_URL}/listening/audio/${audioId}`,
      {
        method: "GET",
        headers: getHeaders(),
      }
    );

    if (!res.ok) {
      throw new Error(
        "Failed to fetch audio"
      );
    }

    return await res.json();
  };

// ======================================================
// SAVE ATTEMPT
// ======================================================

export const saveListeningAttempt =
  async (
    payload: SaveAttemptPayload
  ) => {
    const res = await fetch(
      `${API_BASE_URL}/listening/attempt`,
      {
        method: "POST",

        headers: getHeaders(),

        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      throw new Error(
        "Failed to save attempt"
      );
    }

    return await res.json();
  };

// ======================================================
// GET USER PROGRESS
// ======================================================

export const fetchListeningProgress =
  async (): Promise<ListeningProgress> => {
    const res = await fetch(
      `${API_BASE_URL}/listening/progress`,
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

// ======================================================
// CREATE AUDIO (ADMIN)
// ======================================================

export const createListeningAudio =
  async (payload: {
    title: string;
    transcript: string;
    audio_url: string;
    thumbnail_url?: string;
    difficulty: string;
    category: string;
    accent: string;
    duration?: number;
    is_premium?: boolean;
    is_active?: boolean;
    slug?: string;
  }) => {
    const res = await fetch(
      `${API_BASE_URL}/listening/audio`,
      {
        method: "POST",

        headers: getHeaders(),

        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      throw new Error(
        "Failed to create audio"
      );
    }

    return await res.json();
  };