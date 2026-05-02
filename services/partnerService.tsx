const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api/backend";

export const applyPartner = async (payload: {
  institute_name: string;
  contact_person: string;
  email: string;
  phone: string;
  website: string;
}) => {
  const res = await fetch(`${API_BASE_URL}/auth/partner/apply`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Something went wrong");
  }

  const data = await res.json();
  return data;
};