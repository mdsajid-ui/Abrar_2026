import "server-only";
import crypto from "node:crypto";

/**
 * Payment provider abstraction.
 *  - "razorpay-live" / "razorpay-test": real Razorpay with server-side signature verification.
 *  - "dev-simulator": ONLY when no Razorpay keys are set AND NODE_ENV !== "production".
 *  - "disabled": online payments unavailable (production without keys).
 */
export type PaymentMode = "razorpay-live" | "razorpay-test" | "dev-simulator" | "disabled";

export function getPaymentMode(): PaymentMode {
  const id = process.env.RAZORPAY_KEY_ID?.trim();
  const secret = process.env.RAZORPAY_KEY_SECRET?.trim();
  if (id && secret) return id.startsWith("rzp_live_") ? "razorpay-live" : "razorpay-test";
  if (process.env.NODE_ENV !== "production" && process.env.DEV_PAYMENT_SIMULATOR !== "false") return "dev-simulator";
  return "disabled";
}

export function razorpayKeyId(): string | null {
  return process.env.RAZORPAY_KEY_ID?.trim() || null;
}

export async function createRazorpayOrder(amountPaise: number, receipt: string, notes: Record<string, string>) {
  const id = process.env.RAZORPAY_KEY_ID!;
  const secret = process.env.RAZORPAY_KEY_SECRET!;
  const res = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Basic " + Buffer.from(`${id}:${secret}`).toString("base64"),
    },
    body: JSON.stringify({ amount: amountPaise, currency: "INR", receipt, notes }),
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Razorpay order creation failed (${res.status}): ${text.slice(0, 300)}`);
  }
  return (await res.json()) as { id: string; amount: number; currency: string; status: string };
}

function safeEqualHex(a: string, b: string): boolean {
  const ba = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  return ba.length === bb.length && crypto.timingSafeEqual(ba, bb);
}

/** Verifies the checkout handler signature: HMAC_SHA256(order_id|payment_id, key_secret). */
export function verifyCheckoutSignature(orderId: string, paymentId: string, signature: string): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) return false;
  const expected = crypto.createHmac("sha256", secret).update(`${orderId}|${paymentId}`).digest("hex");
  return safeEqualHex(expected, String(signature ?? ""));
}

/** Verifies webhook payloads: HMAC_SHA256(rawBody, webhook_secret). */
export function verifyWebhookSignature(rawBody: string, signature: string): boolean {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return false;
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  return safeEqualHex(expected, String(signature ?? ""));
}
