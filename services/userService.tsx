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
 * ✅ Safe JSON parser
 */
async function safeJson(res: Response) {
  try {
    return await res.json();
  } catch {
    return {};
  }
}

/**
 * Fetch User Profile
 */
export async function fetchUserProfile(
  token: string
): Promise<UserProfile> {
  if (!token) {
    throw new Error("Authentication token missing.");
  }

  let response: Response;

  try {
    response = await fetch(`${API_URL}/auth/userprofile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
  } catch {
    throw new Error("Network error while fetching profile.");
  }

  const data = await safeJson(response);

  if (!response.ok) {
    throw new Error(data?.detail || "Failed to fetch profile");
  }

  return data;
}

/**
 * Update User Profile
 */
export async function updateUserProfile(
  token: string,
  data: {
    firstName?: string;
    lastName?: string;
    imageFile?: File | null;
  }
): Promise<UserProfile> {
  if (!token) {
    throw new Error("Authentication token missing.");
  }

  const formData = new FormData();

  if (data.firstName) formData.append("first_name", data.firstName);
  if (data.lastName) formData.append("last_name", data.lastName);
  if (data.imageFile instanceof File) {
    formData.append("image", data.imageFile);
  }

  let res: Response;

  try {
    res = await fetch(`${API_URL}/auth/users/me`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
  } catch {
    throw new Error("Network error while updating profile.");
  }

  const result = await safeJson(res);

  if (!res.ok) {
    throw new Error(result?.detail || "Update failed");
  }

  return result?.user || result;
}

/**
 * Update XP and Bonus
 */
export const updateXP = async (
  token: string,
  points: number,
  isBonus: boolean = false,
  gameName: string = "Language Challenge"
) => {
  if (!token) {
    throw new Error("Authentication token missing.");
  }

  let response: Response;

  try {
    response = await fetch(
      `${API_URL}/api/update-xp?game_name=${encodeURIComponent(gameName)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          points_to_add: points,
          is_bonus: isBonus,
        }),
      }
    );
  } catch {
    throw new Error("Network error while updating XP.");
  }

  const data = await safeJson(response);

  if (!response.ok) {
    const err = new Error(data?.detail || "Update failed") as Error & {
      status?: number;
    };
    err.status = response.status;
    throw err;
  }

  return data;
};

/**
 * Sync Streak
 */
export async function syncStreak(
  token: string
): Promise<{ streak: number }> {
  if (!token) {
    throw new Error("Authentication token missing.");
  }

  let response: Response;

  try {
    response = await fetch(`${API_URL}/api/update-activity`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch {
    throw new Error("Network error while syncing streak.");
  }

  const data = await safeJson(response);

  if (!response.ok) {
    throw new Error(data?.detail || "Failed to sync streak");
  }

  return data;
}