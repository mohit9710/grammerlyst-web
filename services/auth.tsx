const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://ec2-3-110-219-38.ap-south-1.compute.amazonaws.com:8000";

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
