const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api/backend";

export interface PurchasePayload {
  amount: number;
  plan_name: string;
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

// services/purchaseService.ts

export const completePurchase = async (
  token: string,
  payload: {
    amount: number;
    plan_name: string;
  }
) => {
  const res = await fetch(`${API_BASE_URL}/purchase/transit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Payment failed");
  }

  return await res.json();
};

/* ---------------- START PAYMENT ---------------- */

export async function startPurchase(
  payload: PurchasePayload
): Promise<QRResponse> {

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("access_token")
      : null;

  const res = await fetch(`${API_BASE_URL}/purchase/start`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Failed to create QR");
  }

  return res.json();
}

/* ---------------- CHECK STATUS ---------------- */

export async function checkPaymentStatus(
  qr_id: string,
  payload: PurchasePayload
): Promise<PaymentStatus> {

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("access_token")
      : null;

  const res = await fetch(
    `${API_BASE_URL}/purchase/status?qr_id=${qr_id}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to check payment");
  }

  return res.json();
}

/* ---------------- FULL FLOW ---------------- */

export async function completePurchaseFlow(
  payload: PurchasePayload,
  onQRGenerated: (qr: string) => void,
  onSuccess: (data: PaymentStatus) => void,
  onError?: (err: any) => void
) {
  let interval: NodeJS.Timeout | null = null;
  let isActive = true;

  try {
    // ✅ Step 1: Create QR
    const qrRes = await startPurchase(payload);

    onQRGenerated(qrRes.qr_image);

    const startTime = Date.now();
    const TIMEOUT = 2 * 60 * 1000; // ⏱️ 2 min max

    // ✅ Step 2: Polling
    interval = setInterval(async () => {
      if (!isActive) return;

      try {
        // ⛔ Stop after timeout
        if (Date.now() - startTime > TIMEOUT) {
          clearInterval(interval!);
          isActive = false;
          throw new Error("Payment timeout");
        }

        const status = await checkPaymentStatus(qrRes.qr_id, payload);

        if (status.status === "success") {
          clearInterval(interval!);
          isActive = false;

          onSuccess(status);
        }
      } catch (err) {
        clearInterval(interval!);
        isActive = false;

        console.error("Polling error:", err);
        onError?.(err);
      }
    }, 5000);

    // ✅ Return cleanup function (VERY IMPORTANT)
    return () => {
      if (interval) clearInterval(interval);
      isActive = false;
    };

  } catch (err) {
    console.error("Purchase flow error:", err);
    onError?.(err);
    throw err;
  }
}