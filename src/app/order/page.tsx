"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { getOrderForCustomer, type Order } from "@/lib/orders-store";
import { OrderReceipt } from "@/components/order/OrderReceipt";

function OrderDetails() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const token = searchParams.get("t");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    const found = getOrderForCustomer(id, token);
    setOrder(found);
    setLoading(false);
  }, [id, token]);

  if (loading) {
    return (
      <div className="section">
        <div className="container center" style={{ padding: "var(--sp-8) 0" }}>
          <h2>Loading Order Details...</h2>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="section">
        <div className="container center" style={{ padding: "var(--sp-8) 0" }}>
          <h2>Order Not Found</h2>
          <p className="muted mb-4">
            Could not retrieve this order. If you have an order ID and phone number, please use order tracking.
          </p>
          <div className="row center" style={{ gap: "12px" }}>
            <Link href="/track" className="btn btn-primary">
              Track Order
            </Link>
            <Link href="/" className="btn btn-outline">
              Back to Store
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <OrderReceipt order={order} />;
}

export default function OrderPage() {
  return (
    <Suspense
      fallback={
        <div className="section">
          <div className="container center" style={{ padding: "var(--sp-8) 0" }}>
            <h2>Loading Order...</h2>
          </div>
        </div>
      }
    >
      <OrderDetails />
    </Suspense>
  );
}
