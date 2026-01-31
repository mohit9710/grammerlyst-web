const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api/backend";

export interface Verb {
  id: number;
  base: string;
  past?: string;
  past_participle?: string;
  meaning?: string;
  example?: string;
  type?: string;
  progress?: {
    views: number;
    stage: number;
  } | null;
}

export async function fetchVerbs(page = 1, limit = 20, token?: string): Promise<Verb[]> {
  // DEBUG: Check this in your browser console!
  console.log("FETCH_VERBS_TOKEN:", token); 

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  // Only attach if token is a real string
  if (token && token.length > 10) { 
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}/verbs?page=${page}&limit=${limit}`, {
    method: "GET",
    headers: headers,
  });

  return res.json();
}


export async function markVerbViewed(
  verbId: number,
  token: string
): Promise<void> {
  try {
    const res = await fetch(`${API_BASE_URL}/verbs/view`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ verb_id: verbId }),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => null);
      console.warn("markVerbViewed failed:", error?.detail);
    }
  } catch (err) {
    console.warn("markVerbViewed error:", err);
  }
}
