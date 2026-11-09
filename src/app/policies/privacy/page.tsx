import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="section">
      <div className="container container-narrow prose">
        <div className="breadcrumbs">
          <ol>
            <li><Link href="/">Home</Link></li>
            <li>Privacy Policy</li>
          </ol>
        </div>

        <h1>Privacy Policy</h1>
        <p className="lead muted">Effective Date: October 2026</p>

        <p>
          At Zippyfeed, operated by Constant Abrar Co., we value your privacy. This policy outlines how we handle customer personal data.
        </p>

        <h2>1. Information We Collect</h2>
        <ul>
          <li><strong>Delivery Data:</strong> Name, delivery address, phone number, and optional email for order status receipts.</li>
          <li><strong>Payment Information:</strong> We do not store credit card numbers or UPI MPINs. All digital transactions are processed directly by RBI-authorized payment aggregators (such as Razorpay).</li>
          <li><strong>Opt-in Marketing:</strong> Explicitly consented phone numbers or emails for restock reminders.</li>
        </ul>

        <h2>2. Data Usage</h2>
        <p>
          Your information is solely used to dispatch orders, contact you for delivery coordination, and issue GST invoices. We never sell, lease, or distribute customer details to third-party marketing brokers.
        </p>

        <h2>3. Your Rights & Unsubscribing</h2>
        <p>
          You can request account deletion or unsubscribe from promotional messaging at any time by visiting our <Link href="/unsubscribe">Unsubscribe portal</Link> or replying STOP to WhatsApp messages.
        </p>
      </div>
    </div>
  );
}
