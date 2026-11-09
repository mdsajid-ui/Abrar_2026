"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/components/cart/CartProvider";
import { formatINR } from "@/lib/pricing";
import { IconTrash, IconArrow, IconTruck } from "@/components/ui/Icons";
import { track } from "@/lib/analytics";

export default function CartPage() {
  const { lines, quote, loading, setQty, remove, applyCoupon, couponCode } = useCart();
  const [couponInput, setCouponInput] = useState(couponCode || "");

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    applyCoupon(couponInput);
  };

  return (
    <div className="section">
      <div className="container">
        <div className="breadcrumbs">
          <ol>
            <li><Link href="/">Home</Link></li>
            <li>Cart</li>
          </ol>
        </div>

        <div className="section-head mb-4">
          <h1>Your Hydration Cart</h1>
          <p className="muted">
            Review your selected bottle cases before proceeding to local delivery checkout.
          </p>
        </div>

        {lines.length === 0 ? (
          <div className="card center" style={{ padding: "var(--sp-8) var(--sp-4)" }}>
            <h2>Your cart is empty</h2>
            <p className="muted mb-5">
              Add fresh water cases for your household, team, or upcoming celebration.
            </p>
            <div>
              <Link href="/shop" className="btn btn-primary">
                Explore Bottle Packs
              </Link>
            </div>
          </div>
        ) : (
          <div className="cart-layout">
            {/* CART ITEMS LIST */}
            <div>
              <div className="card mb-4" style={{ padding: "0 var(--sp-4)" }}>
                {quote?.lines.map((item) => (
                  <div key={item.variantId} className="cart-line">
                    <div className="thumb">
                      <Image
                        src={item.image || "/images/bottle-500ml.svg"}
                        alt={item.productName}
                        width={60}
                        height={80}
                        style={{ objectFit: "contain", height: "100%", width: "auto" }}
                      />
                    </div>

                    <div>
                      <h3 style={{ margin: 0, fontSize: "1.1rem" }}>
                        <Link href={`/products/${item.productSlug}`}>
                          {item.productName}
                        </Link>
                      </h3>
                      <div className="small muted">
                        {item.label} ({item.units} bottles) • {formatINR(item.unitPricePaise)}/pack
                      </div>
                      {item.issue && (
                        <div className="error-text small mt-1">{item.issue}</div>
                      )}
                    </div>

                    <div className="row" style={{ gap: "16px" }}>
                      <div className="qty qty-sm">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          onClick={() => setQty(item.variantId, item.qty - 1)}
                        >
                          -
                        </button>
                        <input type="text" readOnly value={item.qty} />
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          onClick={() => setQty(item.variantId, item.qty + 1)}
                        >
                          +
                        </button>
                      </div>

                      <div className="nowrap font-bold" style={{ minWidth: "80px", textAlign: "right" }}>
                        {formatINR(item.lineTotalPaise)}
                      </div>

                      <button
                        type="button"
                        className="icon-btn"
                        style={{ width: "36px", height: "36px" }}
                        aria-label="Remove item"
                        onClick={() => remove(item.variantId)}
                      >
                        <IconTrash size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* COUPON INPUT */}
              <div className="card">
                <form onSubmit={handleApplyCoupon} className="row" style={{ alignItems: "flex-end" }}>
                  <div className="field" style={{ flex: 1 }}>
                    <label htmlFor="coupon" className="hint">Have a Discount Code?</label>
                    <input
                      id="coupon"
                      type="text"
                      className="input"
                      placeholder="e.g. WELCOME50"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    />
                  </div>
                  <button type="submit" className="btn btn-outline" style={{ minHeight: "48px" }}>
                    Apply Code
                  </button>
                </form>
                {quote?.couponMessage && (
                  <p className={`small mt-2 mb-0 ${quote.couponCode ? "badge-green" : "error-text"}`}>
                    {quote.couponMessage}
                  </p>
                )}
              </div>
            </div>

            {/* ORDER SUMMARY */}
            <div>
              <div className="card summary">
                <h3>Order Summary</h3>

                {quote?.freeDeliveryRemainingPaise !== undefined && quote.freeDeliveryRemainingPaise > 0 && (
                  <div className="alert alert-info small mb-3">
                    <IconTruck size={16} /> Add{" "}
                    <strong>{formatINR(quote.freeDeliveryRemainingPaise)}</strong> more to unlock Free Delivery!
                  </div>
                )}

                <dl>
                  <dt>Subtotal ({quote?.totalBottles ?? 0} bottles):</dt>
                  <dd>{formatINR(quote?.subtotalPaise ?? 0)}</dd>

                  {quote?.discountPaise ? (
                    <>
                      <dt style={{ color: "var(--c-green)" }}>Discount Applied:</dt>
                      <dd style={{ color: "var(--c-green)" }}>-{formatINR(quote.discountPaise)}</dd>
                    </>
                  ) : null}

                  <dt>Estimated Delivery:</dt>
                  <dd>
                    {quote?.deliveryFeePaise === 0
                      ? "FREE"
                      : formatINR(quote?.deliveryFeePaise ?? 4000)}
                  </dd>

                  <dt className="total">Grand Total (incl. GST):</dt>
                  <dd className="total">{formatINR(quote?.totalPaise ?? 0)}</dd>
                </dl>

                <p className="xsmall muted mb-4">
                  *Includes estimated 18% GST ({formatINR(quote?.taxIncludedPaise ?? 0)}). Final delivery charges confirmed at checkout based on PIN.
                </p>

                {quote?.errors && quote.errors.length > 0 && (
                  <div className="alert alert-error small mb-3">
                    {quote.errors.map((err, i) => (
                      <div key={i}>{err}</div>
                    ))}
                  </div>
                )}

                <Link
                  href="/checkout"
                  className={`btn btn-primary btn-block btn-lg ${
                    !quote?.canCheckout || loading ? "disabled" : ""
                  }`}
                  aria-disabled={!quote?.canCheckout || loading}
                  onClick={() => {
                    if (quote?.canCheckout) {
                      track("begin_checkout", { value: (quote?.totalPaise ?? 0) / 100 });
                    }
                  }}
                >
                  Proceed to Checkout <IconArrow size={18} />
                </Link>

                <div className="center mt-3">
                  <Link href="/shop" className="small muted">
                    ← Or continue shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
