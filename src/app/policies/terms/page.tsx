import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Sale & Conditions",
};

export default function TermsPolicyPage() {
  return (
    <div className="section">
      <div className="container container-narrow prose">
        <div className="breadcrumbs">
          <ol>
            <li><Link href="/">Home</Link></li>
            <li>Terms of Sale</li>
          </ol>
        </div>

        <h1>Terms of Sale & Service</h1>
        <p className="lead muted">Effective Date: October 2026</p>

        <h2>1. Agreement to Terms</h2>
        <p>
          By placing an order via this website or requesting bulk quotations, you agree to these Terms of Sale issued by Constant Abrar Co., Kendrapara, Odisha.
        </p>

        <h2>2. Pricing & Maximum Retail Price (MRP)</h2>
        <p>
          In compliance with the Legal Metrology Act, all individual bottles are marked with an MRP of ₹10 (inclusive of GST). Multi-pack carton purchases are priced fairly according to standard unit packaging without unlawful markups.
        </p>

        <h2>3. Delivery Acceptance</h2>
        <p>
          The customer agrees to provide an accessible delivery location with vehicular access. If high-rise stairs or manual lifting beyond standard ground/first floors is required, please notify the driver in advance.
        </p>

        <h2>4. Governing Jurisdiction</h2>
        <p>
          Any disputes arising out of online water purchases or bulk contracts shall be subject to the exclusive jurisdiction of the competent courts in Kendrapara / Cuttack, Odisha.
        </p>
      </div>
    </div>
  );
}
