"use client";

import { useState } from "react";
import Link from "next/link";
import { track } from "@/lib/analytics";

export default function BulkOrdersPage() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ ok?: boolean; msg?: string } | null>(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    organisation: "",
    quantity: "50-100 cases (1200+ bottles)",
    eventDate: "",
    pincode: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    setWhatsappUrl(null);

    setTimeout(() => {
      try {
        const stored = JSON.parse(localStorage.getItem("zf_enquiries_v1") || "[]");
        stored.push({
          type: "bulk",
          ...form,
          createdAt: new Date().toISOString(),
        });
        localStorage.setItem("zf_enquiries_v1", JSON.stringify(stored));
      } catch {}

      const msg = `*Bulk Water Enquiry — Zippyfeed Website*
Name: *${form.name}*
Phone: *${form.phone}*
Organisation: ${form.organisation || "N/A"}
Quantity: *${form.quantity}*
Event Date: ${form.eventDate || "Flexible"}
PIN Code: ${form.pincode || "Kendrapara"}
Message: ${form.message}`;

      const wa = `https://wa.me/918637213741?text=${encodeURIComponent(msg)}`;
      setWhatsappUrl(wa);

      setStatus({
        ok: true,
        msg: "Thank you! Your bulk enquiry has been received. Our B2B coordinator will call you back within 4 business hours.",
      });
      track("generate_lead", { type: "bulk_enquiry" });
      setLoading(false);
    }, 300);
  };

  return (
    <div className="section">
      <div className="container container-narrow">
        <div className="breadcrumbs">
          <ol>
            <li><Link href="/">Home</Link></li>
            <li>Bulk & Events</li>
          </ol>
        </div>

        <div className="section-head">
          <span className="eyebrow">Institutional & Celebration Supply</span>
          <h1>Bulk, Corporate & Event Hydration</h1>
          <p className="lead muted">
            Special institutional pricing, scheduled batch drops, and direct pallet delivery for marriage functions, corporate seminars, retail counters, and eateries.
          </p>
        </div>

        <div className="card mb-6">
          {status && (
            <div className={`alert mb-4 ${status.ok ? "alert-success" : "alert-error"}`}>
              <div>{status.msg}</div>
              {whatsappUrl && (
                <div className="mt-3">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-sm"
                  >
                    Open in WhatsApp to Chat Now →
                  </a>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="stack">
            <div className="form-grid">
              <div className="field">
                <label htmlFor="b-name">Contact Person *</label>
                <input
                  id="b-name"
                  name="name"
                  type="text"
                  className="input"
                  placeholder="e.g. Priyabrata Jena"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="b-phone">Mobile Number *</label>
                <input
                  id="b-phone"
                  name="phone"
                  type="tel"
                  className="input"
                  placeholder="10-digit phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="b-email">Email Address</label>
                <input
                  id="b-email"
                  name="email"
                  type="email"
                  className="input"
                  placeholder="business@example.com"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>

              <div className="field">
                <label htmlFor="b-org">Organisation / Occasion Name</label>
                <input
                  id="b-org"
                  name="organisation"
                  type="text"
                  className="input"
                  placeholder="e.g. Grand Heritage Hall / Tech Conference"
                  value={form.organisation}
                  onChange={handleChange}
                />
              </div>

              <div className="field">
                <label htmlFor="b-qty">Approximate Quantity Required *</label>
                <select
                  id="b-qty"
                  name="quantity"
                  className="select"
                  value={form.quantity}
                  onChange={handleChange}
                >
                  <option value="20-50 cases (480 - 1,200 bottles)">20 - 50 cases (480 - 1,200 bottles)</option>
                  <option value="50-100 cases (1200+ bottles)">50 - 100 cases (1,200 - 2,400 bottles)</option>
                  <option value="100-300 cases">100 - 300 cases (2,400 - 7,200 bottles)</option>
                  <option value="Weekly recurring standing order">Weekly Recurring Standing Order</option>
                  <option value="Full Truck Load (FTL)">Full Truck Load (FTL)</option>
                </select>
              </div>

              <div className="field">
                <label htmlFor="b-date">Target Delivery / Event Date</label>
                <input
                  id="b-date"
                  name="eventDate"
                  type="date"
                  className="input"
                  value={form.eventDate}
                  onChange={handleChange}
                />
              </div>

              <div className="field full">
                <label htmlFor="b-pin">Delivery PIN Code or Destination Location</label>
                <input
                  id="b-pin"
                  name="pincode"
                  type="text"
                  className="input"
                  placeholder="e.g. 754211 Kendrapara"
                  value={form.pincode}
                  onChange={handleChange}
                />
              </div>

              <div className="field full">
                <label htmlFor="b-msg">Specific Requirements or Timings</label>
                <textarea
                  id="b-msg"
                  name="message"
                  className="textarea"
                  placeholder="Tell us about drop logistics, vehicle access, unloading requirements..."
                  value={form.message}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
              {loading ? "Submitting Request..." : "Request Bulk Pricing Quote"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
