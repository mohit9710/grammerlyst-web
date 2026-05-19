const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api/backend";

export interface Tip {
  id: number;
  wrong: string;
  correct: string;
  explanation: string;
  level: "beginner" | "intermediate" | "advanced";
}

export interface DailyMission {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  target_count: number;
  mission_type: string;
  xp_reward: number;
  is_active: number;
}

function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}


export async function getTipOfTheDay(): Promise<Tip> {
  const res = await fetch(`${API_BASE_URL}/api/tips/today`, {
    cache: "no-store",
  });
    console.log(res)
  if (!res.ok) {
    throw new Error("Failed to fetch tip");
  }

  return res.json();
}

export const missionService = {
  async getDailyMissions(): Promise<
    DailyMission[]
  > {

    const token = getAccessToken();

    if (!token) {
      throw new Error(
        "Authentication required"
      );
    }

    const response = await fetch(
      `${API_BASE_URL}/api/daily_missions`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        "Failed to fetch missions"
      );
    }

    return response.json();
  },
};
