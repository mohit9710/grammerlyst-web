const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api/backend";


export interface Pronounciation {
  id: number;
  content: string;
  category: string;
  difficulty_level: string | null;
  created_at: string | null;
}

export async function fetchPronunciation(token?: string): Promise<Pronounciation[]> {
  const res = await fetch(`${API_BASE_URL}/practice/pronunciation`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.detail || "Failed to fetch pronounciation texts");
  }

  return (await res.json()) as Pronounciation[];
}