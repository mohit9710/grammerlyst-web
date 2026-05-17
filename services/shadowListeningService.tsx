const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api/backend";

export const shadowListeningService = {
  async analyze(data: {
    original_text: string;
    spoken_text: string;
  }) {
    const res = await fetch(`${API_BASE_URL}/shadow-listening/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error("Failed to analyze pronunciation");
    }

    return res.json();
  },
};