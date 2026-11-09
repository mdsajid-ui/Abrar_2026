"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import { formatINR } from "@/lib/pricing";
import { IconLock, IconTruck, IconCash } from "@/components/ui/Icons";
import { createLocalOrder } from "@/lib/orders-store";

export default function CheckoutPage() {
  const router = useRouter();
  const { lines, quote, couponCode, clear } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address1: "",
    address2: "",
    landmark: "",
    city: "Kendrapara",
    state: "Odisha",
    pincode: "754211",
    notes: "",
    paymentMethod: "cod" as "online" | "cod",
    marketingConsent: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);
    setFieldErrors({});
    setSubmitting(true);

    setTimeout(() => {
      const result = createLocalOrder({
        lines,
        couponCode: couponCode || null,
        customer: formData,
      });

      if (result.ok) {
        clear();
        router.push(result.next);
      } else {
        setGeneralError(result.error);
        setSubmitting(false);
      }
    }, 300);
  };

  if (!lines.length) {
    return (
      <div className="section">
        <div className="container center" style={{ padding: "var(--sp-8) 0" }}>
          <h2>No items in checkout</h2>
          <p className="muted mb-4">Please add bottles to your cart first.</p>
          <Link href="/shop" className="btn btn-primary">
            Browse Store
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="container">
        <div className="breadcrumbs">
          <ol>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/cart">Cart</Link></li>
            <li>Checkout</li>
          </ol>
        </div>

        <div className="section-head mb-4">
          <h1>Delivery Details & Payment</h1>
          <p className="muted">Enter your doorstep address in Kendrapara to complete your water order.</p>
        </div>

        {generalError && (
          <div className="alert alert-error mb-4">
            {generalError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="cart-layout">
            {/* LEFT: FORM FIELDS */}
            <div className="stack">
              <div className="card">
                <h3>1. Customer Contact</h3>
                <div className="form-grid">
                  <div className="field">
                    <label htmlFor="name">Full Name *</label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      className="input"
                      placeholder="e.g. Ramesh Mohanty"
                      value={formData.name}
                      onChange={handleChange}
                      aria-invalid={!!fieldErrors.name}
                      required
                    />
                    {fieldErrors.name && <span className="error-text">{fieldErrors.name}</span>}
                  </div>

                  <div className="field">
                    <label htmlFor="phone">10-Digit Mobile Number *</label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      className="input"
                      placeholder="e.g. 9876543210"
                      value={formData.phone}
                      onChange={handleChange}
                      aria-invalid={!!fieldErrors.phone}
                      required
                    />
                    {fieldErrors.phone && <span className="error-text">{fieldErrors.phone}</span>}
                  </div>

                  <div className="field full">
                    <label htmlFor="email">Email Address (Optional for invoice receipts)</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      className="input"
                      placeholder="e.g. ramesh@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      aria-invalid={!!fieldErrors.email}
                    />
                    {fieldErrors.email && <span className="error-text">{fieldErrors.email}</span>}
                  </div>
                </div>
              </div>

              <div className="card">
                <h3>2. Delivery Address</h3>
                <div className="form-grid">
                  <div className="field full">
                    <label htmlFor="address1">Street Address, House/Office No. *</label>
                    <input
                      id="address1"
                      name="address1"
                      type="text"
                      className="input"
                      placeholder="e.g. Plot No. 42, Main Road"
                      value={formData.address1}
                      onChange={handleChange}
                      aria-invalid={!!fieldErrors.address1}
                      required
                    />
                    {fieldErrors.address1 && <span className="error-text">{fieldErrors.address1}</span>}
                  </div>

                  <div className="field">
                    <label htmlFor="landmark">Nearby Landmark (Optional)</label>
                    <input
                      id="landmark"
                      name="landmark"
                      type="text"
                      className="input"
                      placeholder="e.g. Near Bus Stand / Temple"
                      value={formData.landmark}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="pincode">6-Digit PIN Code *</label>
                    <input
                      id="pincode"
                      name="pincode"
                      type="text"
                      className="input"
                      placeholder="e.g. 754211"
                      maxLength={6}
                      value={formData.pincode}
                      onChange={handleChange}
                      aria-invalid={!!fieldErrors.pincode}
                      required
                    />
                    {fieldErrors.pincode && <span className="error-text">{fieldErrors.pincode}</span>}
                  </div>

                  <div className="field">
                    <label htmlFor="city">City / Town</label>
                    <input
                      id="city"
                      name="city"
                      type="text"
                      className="input"
                      value={formData.city}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="state">State</label>
                    <input
                      id="state"
                      name="state"
                      type="text"
                      className="input"
                      value={formData.state}
                      readOnly
                    />
                  </div>

                  <div className="field full">
                    <label htmlFor="notes">Delivery Instructions (Optional)</label>
                    <textarea
                      id="notes"
                      name="notes"
                      className="textarea"
                      placeholder="e.g. Leave with security / Call upon arrival / Second floor office"
                      value={formData.notes}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="card">
                <h3>3. Select Payment Method</h3>
                <div className="options">
                  <label className="option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === "cod"}
                      onChange={handleChange}
                    />
                    <div className="dot" />
                    <div className="grow">
                      <strong>Cash on Delivery (COD)</strong>
                      <div className="small muted">Pay with cash or UPI QR directly to the delivery person upon arrival.</div>
                    </div>
                    <IconCash size={24} />
                  </label>

                  <label className="option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="online"
                      checked={formData.paymentMethod === "online"}
                      onChange={handleChange}
                    />
                    <div className="dot" />
                    <div className="grow">
                      <strong>Pay Online (UPI / Card / NetBanking)</strong>
                      <div className="small muted">Instant confirmation via Razorpay secure checkout.</div>
                    </div>
                    <IconLock size={24} />
                  </label>
                </div>

                <div className="mt-4">
                  <label className="check">
                    <input
                      type="checkbox"
                      name="marketingConsent"
                      checked={formData.marketingConsent}
                      onChange={handleChange}
                    />
                    <span className="small muted">
                      Send me delivery tracking notifications and reorder alerts via SMS or WhatsApp.
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* RIGHT: SUMMARY CARD */}
            <div>
              <div className="card summary">
                <h3>Review Items</h3>
                <ul className="stack small mb-4" style={{ listStyle: "none", padding: 0 }}>
                  {quote?.lines.map((item) => (
                    <li key={item.variantId} className="row between" style={{ borderBottom: "1px solid var(--c-line)", paddingBottom: "6px" }}>
                      <span>
                        {item.qty} × {item.productName} ({item.label})
                      </span>
                      <strong>{formatINR(item.lineTotalPaise)}</strong>
                    </li>
                  ))}
                </ul>

                <dl>
                  <dt>Subtotal:</dt>
                  <dd>{formatINR(quote?.subtotalPaise ?? 0)}</dd>
                  {quote?.discountPaise ? (
                    <>
                      <dt style={{ color: "var(--c-green)" }}>Discount:</dt>
                      <dd style={{ color: "var(--c-green)" }}>-{formatINR(quote.discountPaise)}</dd>
                    </>
                  ) : null}
                  <dt>Local Delivery:</dt>
                  <dd>
                    {quote?.deliveryFeePaise === 0 ? "FREE" : formatINR(quote?.deliveryFeePaise ?? 4000)}
                  </dd>
                  <dt className="total">Order Total:</dt>
                  <dd className="total">{formatINR(quote?.totalPaise ?? 0)}</dd>
                </dl>

                <button
                  type="submit"
                  className="btn btn-primary btn-block btn-lg mt-4"
                  disabled={submitting}
                >
                  {submitting
                    ? "Placing Order..."
                    : formData.paymentMethod === "cod"
                    ? "Confirm Cash On Delivery Order"
                    : "Proceed to Payment"}
                </button>

                <p className="xsmall center muted mt-3 mb-0">
                  <IconLock size={14} /> 256-bit Encrypted Transaction & Direct Doorstep Guarantee
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
