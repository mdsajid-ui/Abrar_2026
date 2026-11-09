"use client";

import { useEffect, useState } from "react";
import { listOrders, STATUS_LABEL, type Order } from "@/lib/orders-store";
import { formatINR } from "@/lib/pricing";
import Link from "next/link";

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    setOrders(listOrders({ limit: 50 }));
  }, []);

  return (
    <div className="admin-shell">
      <div className="admin-nav">
        <h2 style={{ color: "#fff", fontSize: "1.2rem", marginBottom: "var(--sp-4)" }}>
          Zippyfeed Admin
        </h2>
        <nav className="stack">
          <Link href="/admin">Orders ({orders.length})</Link>
          <Link href="/shop" target="_blank">View Live Store ↗</Link>
        </nav>
      </div>

      <div className="admin-main">
        <div className="row between mb-5">
          <div>
            <h1>Orders Management</h1>
            <p className="muted small">Real-time local orders from Kendrapara delivery zones.</p>
          </div>
          <div>
            <span className="badge badge-green">Store Active</span>
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Delivery Address</th>
                <th>Items</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Order Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "var(--sp-6)" }}>
                    No orders placed yet. Orders will appear here live when customers checkout.
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.id}>
                    <td>
                      <strong>{o.publicId}</strong>
                      <div className="xsmall muted">{new Date(o.createdAt).toLocaleString("en-IN")}</div>
                    </td>
                    <td>
                      <div>{o.name}</div>
                      <div className="xsmall muted">+91 {o.phone}</div>
                    </td>
                    <td className="small">
                      {o.address1}, {o.city} — <strong>{o.pincode}</strong>
                    </td>
                    <td className="small">
                      {o.items.map((it) => (
                        <div key={it.id}>
                          {it.qty} × {it.variantLabel}
                        </div>
                      ))}
                    </td>
                    <td>
                      <strong>{formatINR(o.totalPaise)}</strong>
                      <div className="xsmall muted">{o.paymentMethod.toUpperCase()}</div>
                    </td>
                    <td>
                      <span className={`badge ${o.paymentStatus === "paid" ? "badge-green" : "badge-amber"}`}>
                        {STATUS_LABEL[o.paymentStatus] || o.paymentStatus}
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-aqua">
                        {STATUS_LABEL[o.status] || o.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
