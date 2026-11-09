"use client";

import { useState } from "react";
import Link from "next/link";
import { formatINR } from "@/lib/pricing";
import { listOrders, STATUS_LABEL, type Order } from "@/lib/orders-store";
import { IconCheck, IconTruck, IconBox } from "@/components/ui/Icons";

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<Order | null>(null);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setOrder(null);
    setLoading(true);

    setTimeout(() => {
      const orders = listOrders({ limit: 100 });
      const found = orders.find(
        (o) =>
          o.publicId.toUpperCase() === orderId.trim().toUpperCase() &&
          o.phone.replace(/\D/g, "").endsWith(phone.trim().replace(/\D/g, "").slice(-10)),
      );

      if (found) {
        setOrder(found);
      } else {
        setError("No order found matching this Order ID and phone number. Please verify your details.");
      }
      setLoading(false);
    }, 300);
  };

  return (
    <div className="section">
      <div className="container container-narrow">
        <div className="breadcrumbs">
          <ol>
            <li><Link href="/">Home</Link></li>
            <li>Track Order</li>
          </ol>
        </div>

        <div className="section-head mb-5">
          <span className="eyebrow">Order Transparency</span>
          <h1>Track Your Water Delivery</h1>
          <p className="muted">Enter your Order ID (e.g. ZF-2610-DEMO1) and registered 10-digit phone number.</p>
        </div>

        <div className="card mb-6">
          <form onSubmit={handleTrack} className="stack">
            <div className="form-grid">
              <div className="field">
                <label htmlFor="track-id">Order Reference ID *</label>
                <input
                  id="track-id"
                  type="text"
                  className="input"
                  placeholder="e.g. ZF-2610-DEMO1"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value.toUpperCase())}
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="track-phone">Phone Number *</label>
                <input
                  id="track-phone"
                  type="tel"
                  className="input"
                  placeholder="10-digit mobile"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Searching..." : "Track Order Status"}
            </button>
          </form>

          {error && <div className="alert alert-error mt-4">{error}</div>}

          {order && (
            <div className="mt-6 p-4 card card-flat" style={{ borderLeft: "4px solid var(--c-aqua-600)" }}>
              <div className="row between mb-3">
                <div>
                  <span className="small muted">Order Reference</span>
                  <h3 style={{ margin: 0 }}>{order.publicId}</h3>
                </div>
                <div>
                  <span className="badge badge-aqua">
                    {STATUS_LABEL[order.status] || order.status}
                  </span>
                </div>
              </div>

              <div className="small muted mb-3">
                Placed on: {new Date(order.createdAt).toLocaleDateString("en-IN", { dateStyle: "long" })} • Destination: <strong>{order.city} ({order.pincode})</strong>
              </div>

              <div className="mb-4">
                <strong>Items:</strong>
                <ul className="small" style={{ margin: "4px 0 0 16px" }}>
                  {order.items.map((it) => (
                    <li key={it.id}>
                      {it.qty} × {it.variantLabel} ({formatINR(it.lineTotalPaise)})
                    </li>
                  ))}
                </ul>
              </div>

              <div className="row between pt-3" style={{ borderTop: "1px solid var(--c-line)" }}>
                <span>Total: <strong>{formatINR(order.totalPaise)}</strong></span>
                <Link href={`/order/?id=${encodeURIComponent(order.publicId)}&t=${order.accessToken}`} className="btn btn-outline btn-sm">
                  View Full Receipt →
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="card card-flat">
          <h3>Need Immediate Support with an Active Delivery?</h3>
          <p className="small muted">
            Our local logistics dispatch team is available from 9:00 AM to 7:00 PM. Have your Order ID handy.
          </p>
          <div className="row">
            <Link href="/contact" className="btn btn-outline btn-sm">Contact Support Team</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
