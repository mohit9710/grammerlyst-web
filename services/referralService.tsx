const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api/backend";

export const fetchReferralDashboard = async (token: string) => {
  const res = await fetch(`${API_BASE_URL}/api/referral/dashboard`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch dashboard");

  return res.json();
};