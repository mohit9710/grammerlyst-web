const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://ec2-3-110-219-38.ap-south-1.compute.amazonaws.com:8000";

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