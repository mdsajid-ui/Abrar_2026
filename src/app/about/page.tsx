import type { Metadata } from "next";
import Link from "next/link";
import { business } from "@/config/business";
import { FactValue } from "@/components/ui/Fact";

export const metadata: Metadata = {
  title: "About Zippyfeed Packaged Drinking Water",
  description: "Learn about Zippyfeed packaged drinking water, our local bottling roots in Kendrapara, and commitment to hygiene and affordability.",
};

export default function AboutPage() {
  return (
    <div className="section">
      <div className="container container-narrow prose">
        <div className="breadcrumbs">
          <ol>
            <li><Link href="/">Home</Link></li>
            <li>About</li>
          </ol>
        </div>

        <span className="eyebrow">Local Commitment</span>
        <h1>Pure, Essential Hydration for Kendrapara</h1>

        <p className="lead">
          Zippyfeed was founded on a simple principle: high quality, certified packaged drinking water should be easily accessible, fairly priced at ₹10 MRP, and conveniently delivered in case packs right to your doorstep.
        </p>

        <h2>Bottled Locally, Delivered Fresh</h2>
        <p>
          Heavy water cases often suffer rough long-distance transit. By bottling directly in Kendrapara and operating our own localized distribution network, we eliminate excess middlemen and transit wear. Every bottle arrives crisp, clean, and securely sealed.
        </p>

        <h2>Mineral Fortification</h2>
        <p>
          Purification removes unwanted contaminants, but drinking water requires balanced minerals for crisp taste and natural replenishment. Zippyfeed is fortified with:
        </p>
        <ul>
          <li><strong>Sodium Bicarbonate:</strong> 0.5 mg</li>
          <li><strong>Magnesium Sulphate:</strong> 0.2 mg</li>
          <li><strong>Potassium Bicarbonate:</strong> 0.1 mg</li>
        </ul>

        <h2>Corporate & Regulatory Details</h2>
        <div className="card card-flat my-4">
          <p className="small mb-1">
            <strong>Manufacturing Facility:</strong><br />
            <FactValue fact={business.legal.manufacturer} />
          </p>
          <p className="small mb-1">
            <strong>Sole Marketing & Distribution Entity:</strong><br />
            <FactValue fact={business.legal.seller} />
          </p>
          <p className="small mb-1">
            <strong>FSSAI Registration:</strong> <FactValue fact={business.legal.fssaiLicence} />
          </p>
          <p className="small mb-0">
            <strong>BIS (ISI) License:</strong> <FactValue fact={business.legal.bisLicence} />
          </p>
        </div>

        <h2>Environmental Responsibility</h2>
        <p>
          All Zippyfeed 500ml bottles are manufactured with food-grade recyclable PET plastic. We partner with local recyclers and encourage all corporate and residential customers to crush empty bottles before disposal.
        </p>

        <div className="mt-6">
          <Link href="/shop" className="btn btn-primary">
            Explore Pack Options
          </Link>
        </div>
      </div>
    </div>
  );
}
