"use client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api/backend";

export interface UserProfile {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  profile_image: string;
  streak: number;
  points: number;
  total_xp: number;
  bonus: number;
}

/**
 * Fetch User Profile
 */
export async function fetchUserProfile(token: string): Promise<UserProfile> {
  const response = await fetch(`${API_URL}/auth/userprofile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to fetch profile");
  return response.json();
}

/**
 * Update User Profile
 */
export async function updateUserProfile(
  token: string,
  data: { firstName?: string; lastName?: string; imageFile?: File | null }
): Promise<UserProfile> {
  const formData = new FormData();
  if (data.firstName) formData.append("first_name", data.firstName);
  if (data.lastName) formData.append("last_name", data.lastName);
  if (data.imageFile) formData.append("image", data.imageFile);

  const res = await fetch(`${API_URL}/auth/users/me`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result.detail || "Update failed");
  return result.user || result;
}

/**
 * Update XP and Bonus (Unified Function)
 * Used for: 
 * 1. Game wins (isBonus = false)
 * 2. Daily Arcade Bonus (isBonus = true)
 */
export const updateXP = async (
  token: string, 
  points: number, 
  isBonus: boolean = false, 
  gameName: string = "Language Challenge"
) => {
  try {
    // encodeURIComponent is important to handle spaces in game names like "Speed Typer"
    const response = await fetch(`${API_URL}/api/update-xp?game_name=${encodeURIComponent(gameName)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        points_to_add: points,
        is_bonus: isBonus,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Backend status 400 with detail "Daily bonus already claimed" will be caught here
      throw { status: response.status, message: data.detail || "Update failed" };
    }

    return data;
  } catch (error) {
    console.error("XP Service Error:", error);
    throw error;
  }
};

/**
 * Sync Streak
 */
export async function syncStreak(token: string): Promise<{ streak: number }> {
  const response = await fetch(`${API_URL}/api/update-activity`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to sync streak");
  return response.json();
}