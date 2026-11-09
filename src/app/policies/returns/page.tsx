import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Returns, Replacements & Refund Policy",
};

export default function ReturnsPolicyPage() {
  return (
    <div className="section">
      <div className="container container-narrow prose">
        <div className="breadcrumbs">
          <ol>
            <li><Link href="/">Home</Link></li>
            <li>Returns & Refunds</li>
          </ol>
        </div>

        <h1>Returns & Refund Policy</h1>
        <p className="lead muted">Effective Date: October 2026</p>

        <h2>1. Consumable Goods Integrity</h2>
        <p>
          Packaged drinking water is a sealed food & beverage product. For safety and hygienic compliance under FSSAI regulations, opened bottles or unsealed crates cannot be returned once accepted.
        </p>

        <h2>2. Damaged or Tampered Bottles</h2>
        <p>
          If your delivery arrives with broken seals, punctured PET bottles, or carton leakage:
        </p>
        <ul>
          <li>Reject the affected crate upon inspection with the driver, or</li>
          <li>Notify our customer service within 24 hours of delivery with photographic proof.</li>
        </ul>
        <p>
          We will issue an immediate free replacement pack on the next delivery run or refund the proportionate amount to your original payment method.
        </p>

        <h2>3. Cancellation Policy</h2>
        <p>
          You may cancel an order free of penalty anytime before dispatch vehicle departs our depot. Once the vehicle is out for delivery, cancellations are subject to a nominal delivery re-routing fee.
        </p>
      </div>
    </div>
  );
}
