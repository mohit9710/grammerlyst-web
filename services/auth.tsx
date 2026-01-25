const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

interface SignInResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export async function signIn(
  email: string,
  password: string
): Promise<SignInResponse> {
  alert(API_BASE_URL)
  const res = await fetch(`${API_BASE_URL}/auth/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.detail || "Login failed");
  }

  return res.json();
}
