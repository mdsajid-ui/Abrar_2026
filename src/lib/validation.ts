/** Shared validation helpers (used on both client for UX and server for enforcement). */

export function normalizePhone(raw: string): string | null {
  const digits = String(raw ?? "").replace(/\D/g, "");
  const ten = digits.length === 12 && digits.startsWith("91") ? digits.slice(2) : digits.length === 11 && digits.startsWith("0") ? digits.slice(1) : digits;
  return /^[6-9]\d{9}$/.test(ten) ? ten : null;
}

export function isEmail(raw: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(raw ?? "").trim()) && String(raw).length <= 254;
}

export function isPincode(raw: string): boolean {
  return /^[1-9]\d{5}$/.test(String(raw ?? "").trim());
}

export function clean(raw: unknown, max = 200): string {
  return String(raw ?? "").replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, max);
}

export type CheckoutInput = {
  name: string;
  phone: string;
  email: string;
  address1: string;
  address2: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
  notes: string;
  paymentMethod: "online" | "cod";
  marketingConsent: boolean;
};

export function validateCheckout(raw: Record<string, unknown>): { ok: true; data: CheckoutInput } | { ok: false; errors: Record<string, string> } {
  const errors: Record<string, string> = {};
  const name = clean(raw.name, 80);
  const phone = normalizePhone(String(raw.phone ?? ""));
  const email = clean(raw.email, 254);
  const address1 = clean(raw.address1, 200);
  const city = clean(raw.city, 80);
  const state = clean(raw.state, 80);
  const pincode = clean(raw.pincode, 6);
  const pm = raw.paymentMethod === "cod" ? "cod" : raw.paymentMethod === "online" ? "online" : null;

  if (name.length < 2) errors.name = "Please enter your full name.";
  if (!phone) errors.phone = "Enter a valid 10-digit Indian mobile number.";
  if (email && !isEmail(email)) errors.email = "Enter a valid email address or leave it blank.";
  if (address1.length < 5) errors.address1 = "Please enter your house/flat and street.";
  if (city.length < 2) errors.city = "Please enter your town or city.";
  if (state.length < 2) errors.state = "Please enter your state.";
  if (!isPincode(pincode)) errors.pincode = "Enter a valid 6-digit PIN code.";
  if (!pm) errors.paymentMethod = "Choose a payment method.";

  if (Object.keys(errors).length) return { ok: false, errors };
  return {
    ok: true,
    data: {
      name, phone: phone!, email, address1, address2: clean(raw.address2, 200), landmark: clean(raw.landmark, 120),
      city, state, pincode, notes: clean(raw.notes, 500), paymentMethod: pm!, marketingConsent: raw.marketingConsent === true,
    },
  };
}
