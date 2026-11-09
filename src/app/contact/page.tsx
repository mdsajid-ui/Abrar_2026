"use client";

import { useState } from "react";
import Link from "next/link";
import { business } from "@/config/business";
import { FactValue } from "@/components/ui/Fact";
import { IconPhone, IconPin } from "@/components/ui/Icons";
import { track } from "@/lib/analytics";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ ok?: boolean; msg?: string } | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });

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
          type: "contact",
          ...form,
          createdAt: new Date().toISOString(),
        });
        localStorage.setItem("zf_enquiries_v1", JSON.stringify(stored));
      } catch {}

      const msg = `*Contact Message — Zippyfeed Website*
From: *${form.name}*
Phone: *${form.phone}*
Email: ${form.email || "N/A"}
Message: ${form.message}`;

      const wa = `https://wa.me/918637213741?text=${encodeURIComponent(msg)}`;
      setWhatsappUrl(wa);

      setStatus({ ok: true, msg: "Message saved! Our customer desk will reach back to you shortly." });
      track("generate_lead", { type: "contact_message" });
      setLoading(false);
    }, 300);
  };

  return (
    <div className="section">
      <div className="container">
        <div className="breadcrumbs">
          <ol>
            <li><Link href="/">Home</Link></li>
            <li>Contact</li>
          </ol>
        </div>

        <div className="grid grid-2" style={{ alignItems: "start", gap: "var(--sp-8)" }}>
          {/* CONTACT INFO */}
          <div>
            <span className="eyebrow">Direct Assistance</span>
            <h1>Get In Touch With Us</h1>
            <p className="lead muted">
              Have questions regarding delivery status, retailer distribution, or water analysis reports? Speak with our team.
            </p>

            <div className="stack mt-6">
              <div className="card card-flat">
                <div className="row mb-2">
                  <IconPhone size={20} />
                  <h3 style={{ margin: 0, fontSize: "1.1rem" }}>Phone & WhatsApp</h3>
                </div>
                <p className="small muted mb-0">
                  Customer Care: <FactValue fact={business.contact.phone} /><br />
                  Operational Hours: Mon–Sat, 9:00 AM – 7:00 PM IST
                </p>
              </div>

              <div className="card card-flat">
                <div className="row mb-2">
                  <IconPin size={20} />
                  <h3 style={{ margin: 0, fontSize: "1.1rem" }}>Office & Depot Location</h3>
                </div>
                <p className="small muted mb-0">
                  <strong>Constant Abrar Co. (Distributor)</strong><br />
                  Haladia, Thakurpatna, Kendrapara, Odisha — 754250<br /><br />
                  <strong>Factory Bottling Plant:</strong><br />
                  M/S S.R. Groups, Gopa Chhak, Kendrapara, Odisha — 754211
                </p>
              </div>
            </div>
          </div>

          {/* CONTACT FORM */}
          <div>
            <div className="card">
              <h3>Send an Inquiry</h3>
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
                        Send via WhatsApp Now →
                      </a>
                    </div>
                  )}
                </div>
              )}

              <form onSubmit={handleSubmit} className="stack">
                <div className="field">
                  <label htmlFor="c-name">Your Full Name *</label>
                  <input
                    id="c-name"
                    type="text"
                    className="input"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-grid">
                  <div className="field">
                    <label htmlFor="c-phone">Phone Number *</label>
                    <input
                      id="c-phone"
                      type="tel"
                      className="input"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="c-email">Email Address</label>
                    <input
                      id="c-email"
                      type="email"
                      className="input"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="c-msg">Message *</label>
                  <textarea
                    id="c-msg"
                    className="textarea"
                    placeholder="How can we assist you today?"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
