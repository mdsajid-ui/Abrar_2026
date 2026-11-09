import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Shipping & Doorstep Delivery Policy",
};

export default function ShippingPolicyPage() {
  return (
    <div className="section">
      <div className="container container-narrow prose">
        <div className="breadcrumbs">
          <ol>
            <li><Link href="/">Home</Link></li>
            <li>Shipping Policy</li>
          </ol>
        </div>

        <h1>Shipping & Delivery Policy</h1>
        <p className="lead muted">Effective Date: October 2026</p>

        <h2>1. Coverage & Service Zones</h2>
        <p>
          Zippyfeed provides localized delivery for packaged water cases within Kendrapara, Thakurpatna, and affiliated PIN codes in Odisha. Enter your PIN code on our cart/homepage to verify coverage.
        </p>

        <h2>2. Delivery Schedules & Dispatch Times</h2>
        <p>
          Standard orders are delivered within 24 to 48 hours of confirmation. For orders confirmed prior to 1:00 PM, same-day delivery is attempted subject to vehicle schedule.
        </p>

        <h2>3. Delivery Charges</h2>
        <ul>
          <li><strong>Standard Local Delivery:</strong> ₹40 per order.</li>
          <li><strong>Free Delivery Tier:</strong> Orders of ₹480 or more (e.g. 2+ large cases) qualify for Free Local Delivery.</li>
        </ul>

        <h2>4. Delivery Protocol</h2>
        <p>
          Our delivery staff will call your registered contact number prior to arrival. If no one is available to receive the shipment, a re-delivery will be attempted on the following working day.
        </p>
      </div>
    </div>
  );
}
