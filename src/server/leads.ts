import "server-only";
import { db, nowIso } from "./db";
import { clean, isEmail, isPincode, normalizePhone } from "@/lib/validation";
import { notify } from "./notify";

export const CONSENT_TEXT = {
  email: "I agree to receive emails from Zippyfeed about restocks, new products and offers. I can unsubscribe at any time.",
  whatsapp: "I agree to receive WhatsApp messages from Zippyfeed about restocks, new products and offers. I can opt out at any time by replying STOP.",
} as const;

/* Simple fixed-window rate limiter (per process). Good enough for a single-instance deployment. */
const buckets = new Map<string, { n: number; reset: number }>();
export function rateLimit(key: string, max = 8, windowMs = 60_000): boolean {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || b.reset < now) {
    buckets.set(key, { n: 1, reset: now + windowMs });
    return true;
  }
  b.n += 1;
  return b.n <= max;
}

export function subscribe(raw: { channel?: unknown; contact?: unknown; consent?: unknown; source?: unknown; website?: unknown }) {
  if (raw.website) return { ok: true as const }; // honeypot: silently accept bots
  const channel = raw.channel === "whatsapp" ? "whatsapp" : raw.channel === "email" ? "email" : null;
  if (!channel) return { ok: false as const, error: "Choose email or WhatsApp." };
  if (raw.consent !== true) return { ok: false as const, error: "Please tick the consent box to subscribe." };
  let contact: string | null = null;
  if (channel === "email") contact = isEmail(String(raw.contact)) ? String(raw.contact).trim().toLowerCase() : null;
  else contact = normalizePhone(String(raw.contact));
  if (!contact) return { ok: false as const, error: channel === "email" ? "Enter a valid email address." : "Enter a valid 10-digit mobile number." };
  db()
    .prepare(
      `INSERT INTO subscribers (channel, contact, consent_text, source, created_at) VALUES (?,?,?,?,?)
       ON CONFLICT(channel, contact) DO UPDATE SET unsubscribed_at = NULL, consent_text = excluded.consent_text, created_at = excluded.created_at`,
    )
    .run(channel, contact, CONSENT_TEXT[channel], clean(raw.source, 60) || "site", nowIso());
  void notify("lead.subscribed", null, { channel, contact });
  return { ok: true as const };
}

export function unsubscribe(channel: string, contact: string) {
  const c = channel === "whatsapp" ? normalizePhone(contact) : contact.trim().toLowerCase();
  if (!c) return false;
  const r = db().prepare("UPDATE subscribers SET unsubscribed_at = ? WHERE channel = ? AND contact = ? AND unsubscribed_at IS NULL").run(nowIso(), channel, c);
  return Number(r.changes) > 0;
}

export function createEnquiry(kind: "bulk" | "contact", raw: Record<string, unknown>) {
  if (raw.website) return { ok: true as const };
  const errors: Record<string, string> = {};
  const name = clean(raw.name, 80);
  const phoneRaw = clean(raw.phone, 20);
  const phone = phoneRaw ? normalizePhone(phoneRaw) : null;
  const email = clean(raw.email, 254);
  const message = clean(raw.message, 2000);
  const pincode = clean(raw.pincode, 6);
  if (name.length < 2) errors.name = "Please enter your name.";
  if (phoneRaw && !phone) errors.phone = "Enter a valid 10-digit mobile number.";
  if (email && !isEmail(email)) errors.email = "Enter a valid email address.";
  if (!phone && !email) errors.phone = errors.phone ?? "Give us a phone number or email so we can reply.";
  if (kind === "contact" && message.length < 5) errors.message = "Please tell us how we can help.";
  if (kind === "bulk" && !clean(raw.quantity, 60)) errors.quantity = "Roughly how many bottles do you need?";
  if (pincode && !isPincode(pincode)) errors.pincode = "Enter a valid 6-digit PIN code.";
  if (Object.keys(errors).length) return { ok: false as const, errors };

  db()
    .prepare(
      `INSERT INTO enquiries (kind, name, phone, email, organisation, quantity, event_date, pincode, message, created_at)
       VALUES (?,?,?,?,?,?,?,?,?,?)`,
    )
    .run(kind, name, phone, email || null, clean(raw.organisation, 120) || null, clean(raw.quantity, 60) || null,
      clean(raw.eventDate, 20) || null, pincode || null, message || "(no message)", nowIso());
  void notify(`enquiry.${kind}`, null, { name, phone, email, quantity: raw.quantity, message });
  return { ok: true as const };
}
