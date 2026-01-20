const API_URL = "http://localhost:8000"; // Your FastAPI URL

export async function fetchUserProfile(token: string) {
  const response = await fetch(`${API_URL}/auth/userprofile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to fetch profile");
  return response.json();
}

export async function updateUserProfile(token: string, data: any) {
  const response = await fetch(`${API_URL}/users/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return response.json();
}