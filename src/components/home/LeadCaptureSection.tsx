"use client";

import { useState } from "react";
import { track } from "@/lib/analytics";

export function LeadCaptureSection() {
  const [channel, setChannel] = useState<"whatsapp" | "email">("whatsapp");
  const [contact, setContact] = useState("");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ ok?: boolean; msg?: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    if (!consent) {
      setStatus({ ok: false, msg: "Please confirm your consent by checking the box." });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      try {
        const stored = JSON.parse(localStorage.getItem("zf_leads_v1") || "[]");
        stored.push({
          channel,
          contact: contact.trim(),
          consent,
          source: "home_footer_band",
          createdAt: new Date().toISOString(),
        });
        localStorage.setItem("zf_leads_v1", JSON.stringify(stored));
      } catch {}

      setStatus({
        ok: true,
        msg:
          channel === "whatsapp"
            ? "Thank you! You're subscribed to Zippyfeed WhatsApp updates."
            : "Thank you! You're subscribed to Zippyfeed newsletter updates.",
      });
      setContact("");
      setConsent(false);
      track("generate_lead", { channel, type: "newsletter" });
      setLoading(false);
    }, 300);
  };

  return (
    <section className="section">
      <div className="container">
        <div className="cta-band">
          <div>
            <span className="eyebrow" style={{ color: "var(--c-aqua-100)" }}>Stay Refreshed</span>
            <h2>Get Restock & Seasonal Offers</h2>
            <p>
              Subscribe for re-order reminders, office delivery schedules, and priority booking for weddings and events in Kendrapara.
            </p>
            <div className="seg mb-4">
              <button
                type="button"
                aria-pressed={channel === "whatsapp"}
                onClick={() => setChannel("whatsapp")}
              >
                WhatsApp Updates
              </button>
              <button
                type="button"
                aria-pressed={channel === "email"}
                onClick={() => setChannel("email")}
              >
                Email Newsletter
              </button>
            </div>
          </div>

          <div>
            <form onSubmit={handleSubmit} className="stack">
              <div className="field">
                <label htmlFor="lead-contact" style={{ color: "#fff" }}>
                  {channel === "whatsapp" ? "Your 10-digit WhatsApp Number" : "Your Email Address"}
                </label>
                <input
                  id="lead-contact"
                  className="input"
                  type={channel === "whatsapp" ? "tel" : "email"}
                  placeholder={channel === "whatsapp" ? "e.g. 9876543210" : "you@example.com"}
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  required
                />
              </div>

              <label className="check">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                />
                <span className="small">
                  {channel === "whatsapp"
                    ? "I agree to receive WhatsApp notifications from Zippyfeed regarding order reminders and offers. Opt-out anytime."
                    : "I agree to receive email newsletters from Zippyfeed. You can unsubscribe anytime."}
                </span>
              </label>

              {status && (
                <div className={`alert small ${status.ok ? "alert-success" : "alert-error"}`}>
                  {status.msg}
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={loading}
              >
                {loading ? "Subscribing..." : "Join VIP Updates"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
