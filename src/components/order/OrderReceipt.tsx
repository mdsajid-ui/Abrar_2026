"use client";

import Link from "next/link";
import { formatINR } from "@/lib/pricing";
import { IconCheck, IconTruck, IconBox, IconPhone } from "@/components/ui/Icons";
import { getWhatsAppOrderUrl, STATUS_LABEL, type Order } from "@/lib/orders-store";

export function OrderReceipt({ order }: { order: Order }) {
  const isConfirmed =
    order.status === "confirmed" ||
    order.paymentStatus === "paid" ||
    order.paymentMethod === "cod";

  const waUrl = getWhatsAppOrderUrl(order);

  return (
    <div className="section">
      <div className="container container-narrow">
        <div className="card">
          <div className="center mb-6">
            <div
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                background: "var(--c-green-50)",
                color: "var(--c-green)",
                display: "grid",
                placeItems: "center",
                margin: "0 auto var(--sp-3)",
              }}
            >
              <IconCheck size={36} />
            </div>
            <span className="eyebrow" style={{ color: "var(--c-green)" }}>
              {isConfirmed ? "Order Confirmed!" : "Order Processing"}
            </span>
            <h1>Thank You, {order.name}!</h1>
            <p className="lead muted">
              We&apos;ve received your order. Your reference number is <strong>{order.publicId}</strong>.
            </p>
          </div>

          <div className="alert alert-info mb-5">
            <strong><IconTruck size={18} /> Delivery Timeline:</strong> Standard dispatch to{" "}
            <strong>{order.pincode} ({order.city})</strong> is usually fulfilled within 24 to 48 hours. Our delivery executive will call on <strong>{order.phone}</strong> before drop-off.
          </div>

          {/* WHATSAPP CONFIRMATION CTA */}
          <div
            className="mb-5 p-4"
            style={{
              background: "#e8f8f0",
              border: "1px solid #c3edd7",
              borderRadius: "var(--r-md)",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <div style={{ fontWeight: 600, color: "#0d6832" }}>
              📱 Instant WhatsApp Order Confirmation
            </div>
            <p className="small muted mb-2">
              Send your order reference directly to our local Kendrapara dispatch desk on WhatsApp for priority scheduling.
            </p>
            <div>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-sm"
                style={{ background: "#25D366", borderColor: "#25D366", color: "#fff" }}
              >
                Send Order Details to WhatsApp (+91 8637213741) →
              </a>
            </div>
          </div>

          {/* ORDER ITEMS TABLE */}
          <h3>Items in This Order</h3>
          <table className="mb-5">
            <thead>
              <tr>
                <th>Item / Pack</th>
                <th style={{ textAlign: "center" }}>Qty</th>
                <th style={{ textAlign: "right" }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((it) => (
                <tr key={it.id}>
                  <td>
                    <strong>{it.productName}</strong>
                    <div className="small muted">
                      {it.variantLabel} ({it.units} bottles)
                    </div>
                  </td>
                  <td style={{ textAlign: "center" }}>{it.qty}</td>
                  <td style={{ textAlign: "right" }}>{formatINR(it.lineTotalPaise)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* FINANCIAL SUMMARY */}
          <dl className="mb-6">
            <div className="row between mb-2">
              <dt className="muted">Subtotal:</dt>
              <dd><strong>{formatINR(order.subtotalPaise)}</strong></dd>
            </div>
            {order.discountPaise > 0 && (
              <div className="row between mb-2" style={{ color: "var(--c-green)" }}>
                <dt>Discount Applied ({order.couponCode}):</dt>
                <dd><strong>-{formatINR(order.discountPaise)}</strong></dd>
              </div>
            )}
            <div className="row between mb-2">
              <dt className="muted">Delivery Fee:</dt>
              <dd>
                <strong>{order.deliveryFeePaise === 0 ? "FREE" : formatINR(order.deliveryFeePaise)}</strong>
              </dd>
            </div>
            <div
              className="row between pt-3"
              style={{ borderTop: "2px solid var(--c-line)", fontSize: "1.2rem" }}
            >
              <dt>Total Amount:</dt>
              <dd><strong>{formatINR(order.totalPaise)}</strong></dd>
            </div>
            <div className="small muted mt-2">
              Payment Method: <strong>{order.paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment"}</strong> • Status: <strong>{STATUS_LABEL[order.paymentStatus] || order.paymentStatus}</strong>
            </div>
          </dl>

          {/* DELIVERY ADDRESS */}
          <div className="card card-flat mb-6">
            <h4 style={{ margin: "0 0 8px 0" }}>Shipping Destination:</h4>
            <p className="small muted mb-0">
              {order.name}<br />
              {order.address1} {order.address2 ? `, ${order.address2}` : ""}<br />
              {order.landmark ? `Landmark: ${order.landmark}` : null}
              {order.landmark && <br />}
              {order.city}, {order.state} — <strong>{order.pincode}</strong><br />
              Contact: <strong>+91 {order.phone}</strong>
            </p>
          </div>

          <div className="row between">
            <Link href="/" className="btn btn-outline">
              Return to Home
            </Link>
            <Link href="/track" className="btn btn-dark">
              Track Status
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
