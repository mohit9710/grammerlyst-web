const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api/backend";

export interface Tip {
  id: number;
  wrong: string;
  correct: string;
  explanation: string;
  level: "beginner" | "intermediate" | "advanced";
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
