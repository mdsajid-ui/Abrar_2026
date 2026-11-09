"use client";

import { useState } from "react";
import Link from "next/link";

export default function UnsubscribePage() {
  const [channel, setChannel] = useState<"whatsapp" | "email">("whatsapp");
  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const handleUnsubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      // Simulate/trigger unsubscribe
      setTimeout(() => {
        setLoading(false);
        setStatus("You have been successfully removed from our communication list.");
      }, 600);
    } catch {
      setLoading(false);
      setStatus("Something went wrong. Please reach out to customer care.");
    }
  };

  return (
    <div className="section">
      <div className="container container-narrow">
        <div className="breadcrumbs">
          <ol>
            <li><Link href="/">Home</Link></li>
            <li>Unsubscribe</li>
          </ol>
        </div>

        <div className="card">
          <h1>Manage Your Subscription Preferences</h1>
          <p className="muted">
            We respect your inbox and messaging space. If you no longer wish to receive reorder reminders or promotional offers, opt out below.
          </p>

          {status ? (
            <div className="alert alert-success mt-4">
              {status}
              <div className="mt-3">
                <Link href="/" className="btn btn-outline btn-sm">Return to Store</Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleUnsubscribe} className="stack mt-4">
              <div className="seg">
                <button
                  type="button"
                  aria-pressed={channel === "whatsapp"}
                  onClick={() => setChannel("whatsapp")}
                >
                  WhatsApp
                </button>
                <button
                  type="button"
                  aria-pressed={channel === "email"}
                  onClick={() => setChannel("email")}
                >
                  Email
                </button>
              </div>

              <div className="field">
                <label htmlFor="unsub-contact">
                  {channel === "whatsapp" ? "Your 10-Digit WhatsApp Mobile Number" : "Your Email Address"}
                </label>
                <input
                  id="unsub-contact"
                  type={channel === "whatsapp" ? "tel" : "email"}
                  className="input"
                  placeholder={channel === "whatsapp" ? "9876543210" : "you@example.com"}
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-dark" disabled={loading}>
                {loading ? "Processing..." : "Unsubscribe from List"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
