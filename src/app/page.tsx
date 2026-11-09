import Link from "next/link";
import Image from "next/image";
import { assetPath } from "@/lib/assets";
import { listProducts } from "@/server/catalog";
import { ProductCard } from "@/components/product/ProductCard";
import { PincodeChecker } from "@/components/home/PincodeChecker";
import { LeadCaptureSection } from "@/components/home/LeadCaptureSection";
import { Bottle3DViewer } from "@/components/product/Bottle3DViewer";
import { Hero3DBottle } from "@/components/product/Hero3DBottle";
import { HeroProductCards } from "@/components/home/HeroProductCards";
import { InteractiveWaterBottle } from "@/components/product/InteractiveWaterBottle";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { business } from "@/config/business";
import { FactValue } from "@/components/ui/Fact";
import {
  IconShield,
  IconMountain,
  IconDrop,
  IconLeaf,
  IconTruck,
  IconCheck,
  IconBox,
  IconLock,
} from "@/components/ui/Icons";

export default function HomePage() {
  const products = listProducts();
  const mainProduct = products[0];

  return (
    <>
      {/* 1. WORLD-CLASS 3D HERO SECTION */}
      <section className="hero">
        <div className="hero-ambient-orb-1" aria-hidden="true" />
        <div className="hero-ambient-orb-2" aria-hidden="true" />

        <div className="container hero-inner">
          <div className="hero-grid">
            <div className="hero-copy">
              <div className="hero-eyebrow-pill">
                <span className="dot" />
                Natural Minerals • Bottled in Kendrapara
              </div>

              <h1 className="hero-headline">
                Purity in Every <em>Drop.</em>
              </h1>

              <p className="hero-lead-quote">
                “Experience refreshing, quality drinking water, delivered with care.”
              </p>

              <div className="hero-trust-row">
                <span className="hero-trust-tag">
                  <IconCheck size={16} /> ₹10 Affordable MRP
                </span>
                <span className="hero-trust-tag">
                  <IconMountain size={16} /> Added Minerals (Na, Mg, K)
                </span>
                <span className="hero-trust-tag">
                  <IconTruck size={16} /> Doorstep Local Delivery
                </span>
                <span className="hero-trust-tag">
                  <IconLeaf size={16} /> 100% Recyclable PET
                </span>
              </div>

              <div className="hero-actions">
                <Link href="/shop" className="btn btn-hero-primary">
                  Order Water
                </Link>
                <Link href="#products" className="btn btn-hero-outline">
                  Explore Our Products →
                </Link>
              </div>
            </div>

            <div className="hero-3d-col">
              <div className="hero-3d-wrapper">
                <Hero3DBottle />
                <div className="hero-3d-hint-pill" aria-hidden="true">
                  <span>🔄</span> Drag or move cursor to interact in 3D
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Product Cards Carousel at Base of Hero */}
        <HeroProductCards />
      </section>

      {/* 2. VERIFIED PRODUCT BENEFITS */}
      <section className="section section-mist">
        <div className="container">
          <ScrollReveal>
            <div className="section-head center">
              <span className="eyebrow">Verified Quality</span>
              <h2>Pure Taste, Purposeful Hydration</h2>
              <p className="lead muted">
                Formulated to meet strict quality and mineral balance standards for every sip.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-4">
            <ScrollReveal delayMs={50}>
              <div className="card">
                <div className="feature-icon">
                  <IconShield size={24} />
                </div>
                <h3>Pure & Safe</h3>
                <p className="small muted">
                  Packaged through multi-stage hygienic filtration, UV disinfection, and strict microbial testing for total peace of mind.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delayMs={100}>
              <div className="card">
                <div className="feature-icon red">
                  <IconMountain size={24} />
                </div>
                <h3>Natural Minerals</h3>
                <p className="small muted">
                  Carefully infused with Sodium Bicarbonate (0.5mg), Magnesium Sulphate (0.2mg), and Potassium Bicarbonate (0.1mg) for clean taste.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delayMs={150}>
              <div className="card">
                <div className="feature-icon">
                  <IconDrop size={24} />
                </div>
                <h3>Everyday Convenience</h3>
                <p className="small muted">
                  Sleek 500ml single-serve design that slips effortlessly into car cup holders, gym bags, school kits, and office drawers.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delayMs={200}>
              <div className="card">
                <div className="feature-icon red">
                  <IconLeaf size={24} />
                </div>
                <h3>Responsible PET</h3>
                <p className="small muted">
                  BPA-free food-grade PET plastic that is 100% recyclable. We actively encourage responsible post-use bottle crushing.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 3. PRODUCT CATALOGUE SECTION */}
      <section className="section" id="products">
        <div className="container">
          <div className="row between mb-6" style={{ alignItems: "flex-end" }}>
            <div className="section-head mb-0">
              <span className="eyebrow">Shop By Pack</span>
              <h2>Order Fresh Cases Directly to Your Door</h2>
              <p className="lead muted">
                Delivered in sturdy 12, 24, and 48-bottle case packs. No individual delivery markups—just honest ₹10/bottle value.
              </p>
            </div>
            <div>
              <Link href="/shop" className="btn btn-outline">
                View Full Collection →
              </Link>
            </div>
          </div>

          <div className="grid grid-3">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          {/* 3D INTERACTIVE PRODUCT EXPLORATION */}
          <div className="mt-8 card" style={{ padding: "var(--sp-6)" }}>
            <div className="grid grid-2" style={{ alignItems: "center" }}>
              <div>
                <span className="eyebrow">Interactive 3D Experience</span>
                <h2>Explore the Zippyfeed 500ml Bottle in 3D</h2>
                <p className="muted">
                  Inspect our ergonomic bottle structure, tamper-evident white cap, and verified label details from any angle. Click and drag on the 3D model to rotate 360°.
                </p>
                <ul className="stack small mb-5" style={{ listStyle: "none", padding: 0 }}>
                  <li className="row">
                    <IconCheck size={18} /> Official Zippyfeed logo & Kendrapara branding
                  </li>
                  <li className="row">
                    <IconCheck size={18} /> Declared nutritional electrolytes (Sodium, Magnesium, Potassium)
                  </li>
                  <li className="row">
                    <IconCheck size={18} /> Recyclable food-grade clear PET material
                  </li>
                </ul>
                <div className="row">
                  <Link href="/products/zippyfeed-packaged-drinking-water-500ml" className="btn btn-primary">
                    Order This Bottle Pack
                  </Link>
                  <Link href="/quality" className="btn btn-outline">
                    View Quality Process
                  </Link>
                </div>
              </div>

              <div>
                <Bottle3DViewer />
              </div>
            </div>
          </div>

          <div className="mt-8 row between" style={{ background: "var(--c-aqua-50)", padding: "var(--sp-5)", borderRadius: "var(--r-lg)" }}>
            <div>
              <h3 style={{ margin: 0 }}>Need 50+ cases for an institution, wedding, or store?</h3>
              <p className="small muted mb-0">We offer specialized B2B pricing and tailored schedule drop-offs.</p>
            </div>
            <Link href="/bulk-orders" className="btn btn-dark">
              Request B2B Quote
            </Link>
          </div>
        </div>
      </section>

      {/* 4. LIFESTYLE & USE CASES */}
      <section className="section section-mist">
        <div className="container">
          <ScrollReveal>
            <div className="section-head center">
              <span className="eyebrow">Real World Application</span>
              <h2>Built For Your Day-to-Day</h2>
              <p className="lead muted">
                Whether you are powering through meetings or organizing a 500-guest gathering, Zippyfeed delivers reliable replenishment.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-4">
            <ScrollReveal delayMs={50}>
              <div className="use-card">
                <div className="img">
                  <Image
                    src={assetPath("/images/use-office.jpg")}
                    alt="Zippyfeed bottle on a modern office desk"
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="txt">
                  <h3>Offices & Desks</h3>
                  <p className="small muted">
                    Keep conference tables stocked and employees energized with hygienic personal bottles.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delayMs={100}>
              <div className="use-card">
                <div className="img">
                  <Image
                    src={assetPath("/images/use-events.jpg")}
                    alt="Zippyfeed bottles set out at a banquet table"
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="txt">
                  <h3>Events & Weddings</h3>
                  <p className="small muted">
                    Pristine presentation and hassle-free batch drop-offs for marriage halls, conferences, and festivals.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delayMs={150}>
              <div className="use-card">
                <div className="img">
                  <Image
                    src={assetPath("/images/use-home.jpg")}
                    alt="Cases of drinking water bottles in a home kitchen"
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="txt">
                  <h3>Homes & Kitchens</h3>
                  <p className="small muted">
                    Keep cold cases ready in your pantry for guests, family outings, and on-the-go hydration.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delayMs={200}>
              <div className="use-card">
                <div className="img">
                  <Image
                    src={assetPath("/images/use-travel.jpg")}
                    alt="Water bottle in a travel bag pocket on a road trip"
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="txt">
                  <h3>Road Trips & Travel</h3>
                  <p className="small muted">
                    Spill-proof, durable caps that keep your water secure in bags, bus trips, and highway drives.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 5. DELIVERY PINCODE CHECKER & SERVICE AREA */}
      <section className="section">
        <div className="container">
          <div className="grid grid-2" style={{ alignItems: "center" }}>
            <div>
              <span className="eyebrow">Local Logistics</span>
              <h2>Direct Doorstep Delivery in Kendrapara</h2>
              <p className="lead muted">
                Packaged drinking water is heavy. Why carry cases from the market when our dedicated delivery team brings them straight to your home, pantry, or shop?
              </p>
              <ul className="stack small" style={{ listStyle: "none", padding: 0 }}>
                <li className="row">
                  <IconTruck size={20} /> Same-day or next-day delivery on local PIN codes
                </li>
                <li className="row">
                  <IconBox size={20} /> Safely boxed and shrink-wrapped hygiene packs
                </li>
                <li className="row">
                  <IconLock size={20} /> Cash on Delivery & Secure Online UPI / Cards
                </li>
              </ul>
            </div>

            <div>
              <PincodeChecker />
            </div>
          </div>
        </div>
      </section>

      {/* 6. TRANSPARENCY & TRUST SIGNALS */}
      <section className="section section-mist">
        <div className="container">
          <div className="section-head center">
            <span className="eyebrow">Integrity First</span>
            <h2>Authentic Manufacturer & Regulatory Details</h2>
            <p className="lead muted">
              We believe in honest labeling. Here is the verified information printed directly on our bottle packaging.
            </p>
          </div>

          <div className="grid grid-3">
            <div className="card">
              <h3>Facility & Bottling</h3>
              <p className="small muted">
                <strong>Manufactured by:</strong><br />
                <FactValue fact={business.legal.manufacturer} />
              </p>
              <p className="small muted">
                <strong>Sold & Distributed by:</strong><br />
                <FactValue fact={business.legal.seller} />
              </p>
            </div>

            <div className="card">
              <h3>Certifications & Quality</h3>
              <p className="small muted">
                <strong>FSSAI Licence:</strong><br />
                <FactValue fact={business.legal.fssaiLicence} />
              </p>
              <p className="small muted">
                <strong>BIS (ISI) Certification:</strong><br />
                <FactValue fact={business.legal.bisLicence} />
              </p>
              <p className="xsmall muted">
                *Packaged drinking water in India strictly requires Bureau of Indian Standards (BIS) CM/L certification and FSSAI manufacturing licenses.
              </p>
            </div>

            <div className="card">
              <h3>Label Nutritional Facts</h3>
              <p className="small muted">Typical values per 100ml as declared:</p>
              <ul className="small" style={{ paddingLeft: "1.2rem", margin: 0 }}>
                {business.label.minerals.map((m) => (
                  <li key={m.name}>
                    <strong>{m.name}:</strong> {m.amount}
                  </li>
                ))}
              </ul>
              <p className="xsmall muted mt-2">
                Storage: {business.label.storage}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. LEAD CAPTURE & RE-ORDER SUBSCRIPTIONS */}
      <LeadCaptureSection />
    </>
  );
}
