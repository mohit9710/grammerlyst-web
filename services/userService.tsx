const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api/backend";

export interface UserProfile {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  profile_image: string;
  streak: number;
  points: number;
  total_xp: number; // Aapka naya field
  bonus: number;    // Aapka naya field
}

export async function fetchUserProfile(token: string): Promise<UserProfile> {
  const response = await fetch(`${API_URL}/auth/userprofile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  
  if (!response.ok) throw new Error("Failed to fetch profile");
  
  // Direct return kyuki aapka JSON data direct object hai
  return response.json(); 
}

/**
 * Updates user profile using FormData to support file uploads (images)
 */
export async function updateUserProfile(
  token: string,
  data: { firstName?: string; lastName?: string; imageFile?: File | null }
) {
  const formData = new FormData();

  // FastAPI expects these keys based on your Python parameters
  if (data.firstName) formData.append("first_name", data.firstName);
  if (data.lastName) formData.append("last_name", data.lastName);
  if (data.imageFile) formData.append("image", data.imageFile);

  const res = await fetch(`${API_URL}/auth/users/me`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      // Reminder: No 'Content-Type' header here; let the browser set it!
    },
    body: formData,
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result.detail || "Update failed");

  return result.user; // Returning the nested user object from your backend JSON
}