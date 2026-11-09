import type { Metadata } from "next";
import Link from "next/link";
import { business } from "@/config/business";
import { FactValue } from "@/components/ui/Fact";
import { IconShield, IconDrop, IconMountain, IconCheck } from "@/components/ui/Icons";

export const metadata: Metadata = {
  title: "Water Quality, Multi-Stage Filtration & Lab Standards",
  description: "Discover the multi-stage hygienic purification, mineral fortification, and testing standards behind Zippyfeed Packaged Drinking Water.",
};

export default function QualityPage() {
  const processSteps = [
    {
      title: "1. Micron Sand & Carbon Filtration",
      desc: "Removes turbidity, suspended particulate matter, physical sediments, and organic impurities, leaving base raw water visibly crystal-clear.",
    },
    {
      title: "2. Reverse Osmosis (RO) Demineralization",
      desc: "High-pressure semi-permeable membranes strip out excess heavy dissolved solids, nitrates, and microscopic chemical compounds down to 0.0001 microns.",
    },
    {
      title: "3. Precision Mineral Fortification",
      desc: "Purified water is carefully balanced with food-grade Sodium Bicarbonate (0.5mg/100ml), Magnesium Sulphate (0.2mg/100ml), and Potassium Bicarbonate (0.1mg/100ml) to achieve crisp refreshment and optimum pH.",
    },
    {
      title: "4. Ultraviolet (UV) & Ozonation Barrier",
      desc: "Twin disinfection mechanisms destroy microbial bacteria and pathogens while enriching residual dissolved oxygen for long-lasting freshness inside sealed PET containers.",
    },
    {
      title: "5. Automated Bottle Rinsing & Touchless Capping",
      desc: "Pre-forms are blown, immediately sanitized with sterile water rinses, filled, and hermetically capped without manual human contact.",
    },
  ];

  return (
    <div className="section">
      <div className="container">
        <div className="breadcrumbs">
          <ol>
            <li><Link href="/">Home</Link></li>
            <li>Water Quality</li>
          </ol>
        </div>

        <div className="section-head center">
          <span className="eyebrow">Purity Protocol</span>
          <h1>Engineered for Safety, Balanced for Taste</h1>
          <p className="lead muted">
            Every bottle of Zippyfeed Kendrapara Packaged Drinking Water undergoes a strict 5-stage purification and quality inspection pipeline.
          </p>
        </div>

        {/* 5 STAGES */}
        <div className="grid grid-3 mb-8">
          {processSteps.map((step, idx) => (
            <div key={idx} className="card">
              <div className="feature-icon">
                <IconDrop size={24} />
              </div>
              <h3>{step.title}</h3>
              <p className="small muted mb-0">{step.desc}</p>
            </div>
          ))}

          <div className="card" style={{ background: "var(--c-mist)" }}>
            <div className="feature-icon red">
              <IconShield size={24} />
            </div>
            <h3>Microbial Lab Testing</h3>
            <p className="small muted mb-0">
              Each production batch is quarantined until internal laboratory microbial plating confirms zero coliform and compliance with IS 14543 standards.
            </p>
          </div>
        </div>

        {/* MINERAL PROFILE TABLE */}
        <div className="grid grid-2" style={{ alignItems: "center", gap: "var(--sp-8)" }}>
          <div>
            <span className="eyebrow">Natural Mineral Balance</span>
            <h2>Why Added Minerals Make a Difference</h2>
            <p className="muted">
              Unlike distilled water which can taste flat and acidic, Zippyfeed provides essential electrolytes that replenish your daily hydration needs.
            </p>
            <ul className="stack small" style={{ listStyle: "none", padding: 0 }}>
              <li className="row">
                <IconCheck size={18} /> <strong>Sodium Bicarbonate:</strong> Maintains alkalinity and neutralizes palate acidity.
              </li>
              <li className="row">
                <IconCheck size={18} /> <strong>Magnesium Sulphate:</strong> Supports muscle relaxation and cellular hydration.
              </li>
              <li className="row">
                <IconCheck size={18} /> <strong>Potassium Bicarbonate:</strong> Essential intracellular electrolyte for vital energy.
              </li>
            </ul>
          </div>

          <div className="card">
            <h3>Declared Label Mineral Values</h3>
            <p className="xsmall muted mb-4">Values typical per 100ml as printed on retail bottle packaging:</p>
            <table>
              <thead>
                <tr>
                  <th>Mineral Compound</th>
                  <th style={{ textAlign: "right" }}>Typical Value</th>
                </tr>
              </thead>
              <tbody>
                {business.label.minerals.map((m) => (
                  <tr key={m.name}>
                    <td>{m.name}</td>
                    <td style={{ textAlign: "right" }}><strong>{m.amount}</strong></td>
                  </tr>
                ))}
                <tr>
                  <td>MRP per bottle</td>
                  <td style={{ textAlign: "right" }}><strong>₹10 (incl. GST)</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* REGULATORY COMPLIANCE CALLOUT */}
        <div className="mt-8 card card-flat center">
          <h3>Need Batch Inspection Certificates?</h3>
          <p className="small muted mb-4">
            Institutions, schools, and hospitals ordering in bulk can request certified lab test reports and water parameters from our quality assurance desk.
          </p>
          <div className="row" style={{ justifyContent: "center" }}>
            <Link href="/contact" className="btn btn-dark btn-sm">
              Contact Quality Desk (+91 8637213741)
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
