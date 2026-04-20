"use server";

import { withAuthRefresh } from "@/lib/spree";

export async function finalizeRazorpaySession(
  paymentSessionId: string,
  razorpayPaymentId: string,
  razorpaySignature: string
) {
  return withAuthRefresh(async (options) => {
    // We send the signatures as external_data, which your Gateway's 
    // complete_payment_session method is already programmed to read!
    const response = await fetch(
      `${process.env.SPREE_API_URL}/api/v2/storefront/payment_sessions/${paymentSessionId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${(options as any).bearerToken}`,
        },
        body: JSON.stringify({
          external_data: {
            razorpay_payment_id: razorpayPaymentId,
            razorpay_signature: razorpaySignature,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to verify Razorpay signature with backend.");
    }

    return await response.json();
  });
}
