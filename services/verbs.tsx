const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export interface Verb {
  id: number;
  base: string;
  past: string;
  past_participle: string;
  meaning?: string;
}

export async function fetchVerbs(
  page: number = 1,
  limit: number = 20,
  token?: string
): Promise<Verb[]> {
  const res = await fetch(`${API_BASE_URL}/verbs?page=${page}&limit=${limit}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.detail || "Failed to fetch verbs");
  }

  return (await res.json()) as Verb[];
}
