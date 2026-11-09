import "server-only";
import { db, nowIso } from "./db";

/**
 * Notification outbox. Every order event is stored; if NOTIFY_WEBHOOK_URL is set,
 * it is also POSTed there (connect to your email/WhatsApp/SMS provider via Zapier, Make,
 * or your own service). Failures never block the order flow.
 */
export async function notify(event: string, orderId: number | null, payload: Record<string, unknown>) {
  const url = process.env.NOTIFY_WEBHOOK_URL?.trim();
  const info = db()
    .prepare("INSERT INTO notifications (order_id, event, payload, status, created_at) VALUES (?,?,?,?,?)")
    .run(orderId, event, JSON.stringify(payload), url ? "pending" : "stored", nowIso());
  if (!url) return;
  const id = Number(info.lastInsertRowid);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event, ...payload }),
      signal: AbortSignal.timeout(5000),
    });
    db().prepare("UPDATE notifications SET status = ? WHERE id = ?").run(res.ok ? "sent" : `failed:${res.status}`, id);
  } catch (e) {
    db().prepare("UPDATE notifications SET status = ? WHERE id = ?").run("failed", id);
    console.error("[notify] webhook failed", e);
  }
}
