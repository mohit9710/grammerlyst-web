const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api/backend";

export interface PurchasePayload {
  amount: number;
  plan_name: string;
  billing: string;
}

export interface QRResponse {
  qr_id: string;
  qr_image: string;
}

export interface PaymentStatus {
  status: "pending" | "success";
  payment_id?: string;
  commission?: number;
}

export interface PurchaseResponse {
  success: boolean;
  billing: string;
  order_id: string;
  payment_url: string;
  plan: string;
}

export interface Plan {
  id: number;
  name: string;
  sub_name: string;
  billing_type: "monthly" | "yearly";
  price: number;
  duration: number;
}

export async function completePurchase(
  token: string,
  payload: PurchasePayload
): Promise<PurchaseResponse> {

  if (!token) {
    throw new Error("Authentication token missing.");
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/purchase/create-payment-link`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: payload.amount,
          plan: payload.plan_name,
          billing: payload.billing,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.detail || data.message || "Payment creation failed."
      );
    }

    if (!data.success || !data.payment_url) {
      throw new Error("Payment link was not generated.");
    }

    return data as PurchaseResponse;


    /*if (data.success && data.payment_url) {
      window.location.href = data.payment_url;
    } else {
      console.error("Payment link creation failed.");
    }


    if (!response.ok) {
      throw new Error(
        data.detail || data.message || "Payment creation failed."
      );
    }

    return data;*/

  } catch (error) {
    console.error("Purchase error:", error);
    throw error;
  }
}

export const fetchMyPlan = async () => {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("access_token")
      : null;

  const res = await fetch(`${API_BASE_URL}/purchase/my-plan`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch plan");
  }

  return res.json();
};

/*---------------- Plans ------------------ */

export const fetchPlans = async (): Promise<Plan[]> => {
  const res = await fetch(`${API_BASE_URL}/api/plans`);

  if (!res.ok) {
    throw new Error("Failed to fetch plans");
  }

  return res.json();
};