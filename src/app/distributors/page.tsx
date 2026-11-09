import type { Metadata } from "next";
import Link from "next/link";
import { business } from "@/config/business";
import { IconStore, IconTruck, IconBox, IconPhone } from "@/components/ui/Icons";

export const metadata: Metadata = {
  title: "Retailer & Distributor Partner Program | Zippyfeed Kendrapara",
  description: "Become an authorized retail stocking partner or local sub-distributor for Zippyfeed packaged drinking water.",
};

export default function DistributorPage() {
  return (
    <div className="section">
      <div className="container">
        <div className="breadcrumbs">
          <ol>
            <li><Link href="/">Home</Link></li>
            <li>Distributor Partner Program</li>
          </ol>
        </div>

        <div className="grid grid-2" style={{ alignItems: "center", gap: "var(--sp-8)" }}>
          <div>
            <span className="eyebrow">B2B Network Expansion</span>
            <h1>Partner With Zippyfeed in Odisha</h1>
            <p className="lead muted">
              Join our fast-growing distribution ecosystem. We supply high-margin packaged drinking water crates directly to grocery retailers, hotels, restaurants, bakeries, and travel kiosks.
            </p>

            <ul className="stack small" style={{ listStyle: "none", padding: 0 }}>
              <li className="row">
                <IconBox size={20} /> <strong>Consistent Supply:</strong> Direct factory logistics preventing out-of-stock weekend surges.
              </li>
              <li className="row">
                <IconStore size={20} /> <strong>Retail Margins:</strong> Attractive retailer margins on MRP ₹10 single-serve bottles.
              </li>
              <li className="row">
                <IconTruck size={20} /> <strong>Scheduled Batch Drops:</strong> Weekly pre-arranged delivery van runs straight to your storefront.
              </li>
            </ul>

            <div className="row mt-6">
              <Link href="/bulk-orders" className="btn btn-primary">
                Apply for Retail Dealership
              </Link>
              <a href="tel:8637213741" className="btn btn-outline">
                Call +91 8637213741
              </a>
            </div>
          </div>

          <div className="card">
            <h3>Distribution Operations & Inquiries</h3>
            <p className="small muted">
              Our regional distribution office coordinates merchant onboarding and route schedules across Kendrapara and surrounding districts.
            </p>

            <div className="stack small mt-4">
              <div>
                <strong>Sole Marketing & Distribution Entity:</strong><br />
                Constant Abrar Co.<br />
                Haladia, Thakurpatna, Kendrapara, Odisha — 754250
              </div>
              <div>
                <strong>Direct Dealer Hotline:</strong><br />
                <a href="tel:8637213741" style={{ fontSize: "1.1rem", fontWeight: 700 }}>
                  +91 8637213741
                </a>
              </div>
              <div>
                <strong>Commercial Desk Email:</strong><br />
                <a href="mailto:abrar@storzen.io">abrar@storzen.io</a>
              </div>
              <div>
                <strong>Packaging Specifications:</strong><br />
                Corrugated cartons of 12, 24, and 48 units (500ml PET bottles with tamper-evident seal).
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
