const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://ec2-3-110-219-38.ap-south-1.compute.amazonaws.com:8000";

export interface QuizOption {
  id: number;
  option_text: string;
  is_correct: boolean; // Note: Ensure your backend schema matches this
}

export interface QuizQuestion {
  id: number;
  lesson_id: number;
  question_text: string;
  options: QuizOption[]; // Nested options from our Pydantic schema
}

export async function fetchQuizData(
  lesson_id: number,
  token?: string
): Promise<QuizQuestion[]> {
  // Corrected the URL to use the /quiz/ prefix and template literal variable
  const res = await fetch(`${API_BASE_URL}/quiz/${lesson_id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.detail || `Failed to fetch quiz for lesson ${lesson_id}`);
  }

  // Returns a list of questions, each containing their own options
  return (await res.json()) as QuizQuestion[];
}