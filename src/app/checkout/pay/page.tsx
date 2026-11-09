"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { formatINR } from "@/lib/pricing";
import { getOrderForCustomer, updateOrderStatus } from "@/lib/orders-store";

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const publicId = searchParams.get("id") || "";
  const token = searchParams.get("t");

  const [simulating, setSimulating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (publicId) {
      const found = getOrderForCustomer(publicId, token);
      setOrder(found);
    }
  }, [publicId, token]);

  const handleSimulatePayment = (outcome: "success" | "failure" | "cancel") => {
    setSimulating(true);
    setTimeout(() => {
      if (outcome === "success") {
        updateOrderStatus(publicId, "confirmed", "paid", "Simulated payment verified");
        router.push(`/order/?id=${encodeURIComponent(publicId)}&t=${token || ""}`);
      } else if (outcome === "cancel") {
        updateOrderStatus(publicId, "cancelled", "failed", "Customer cancelled payment");
        router.push("/cart");
      } else {
        updateOrderStatus(publicId, "pending_payment", "failed", "Simulated payment failure");
        setError("Simulated payment failure recorded. You can retry or choose Cash on Delivery.");
      }
      setSimulating(false);
    }, 400);
  };

  return (
    <div className="section">
      <div className="container container-narrow">
        <div className="card">
          <span className="eyebrow">Payment Processing</span>
          <h1>Complete Your Payment</h1>
          <p className="muted">
            Order Reference: <strong>{publicId || "ZF-ONLINE"}</strong>
          </p>

          {order && (
            <div className="mb-4 p-3 card card-flat">
              <div className="row between">
                <span>Amount Due:</span>
                <strong>{formatINR(order.totalPaise)}</strong>
              </div>
            </div>
          )}

          {error && <div className="alert alert-error mb-4">{error}</div>}

          {/* DEVELOPMENT SIMULATOR BANNER */}
          <div className="dev-mode mb-5">
            <h3 style={{ marginTop: 0, color: "var(--c-amber)" }}>
              🧪 Development & Demo Payment Mode
            </h3>
            <p className="small">
              This site is configured for static hosting. For online payments, select an action below to test your checkout flow:
            </p>

            <div className="row mt-4" style={{ gap: "10px" }}>
              <button
                type="button"
                className="btn btn-primary"
                disabled={simulating}
                onClick={() => handleSimulatePayment("success")}
              >
                {simulating ? "Processing..." : "Simulate Successful Payment"}
              </button>
              <button
                type="button"
                className="btn btn-outline"
                disabled={simulating}
                onClick={() => handleSimulatePayment("failure")}
              >
                Simulate Payment Declined
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                disabled={simulating}
                onClick={() => handleSimulatePayment("cancel")}
              >
                Cancel
              </button>
            </div>
          </div>

          <div className="center">
            <Link
              href={`/order/?id=${encodeURIComponent(publicId)}&t=${token || ""}`}
              className="small muted"
            >
              View Order Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentGatewayPage() {
  return (
    <Suspense
      fallback={
        <div className="section">
          <div className="container center" style={{ padding: "var(--sp-8) 0" }}>
            <h2>Loading Payment Gateway...</h2>
          </div>
        </div>
      }
    >
      <PaymentContent />
    </Suspense>
  );
}
