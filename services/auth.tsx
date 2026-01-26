const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api/backend";

interface SignInResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

interface SignupPayload {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export async function signIn(
  email: string,
  password: string
): Promise<SignInResponse> {
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

export async function signupUser(payload: SignupPayload) {
  const res = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Signup failed");
  }

  return data; // { token, user }
}
