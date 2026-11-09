import Link from "next/link";
import { business } from "@/config/business";
import { FactValue } from "@/components/ui/Fact";

export function SiteFooter() {
  const { legal, contact } = business;
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <p className="logo" style={{ marginBottom: 12 }}>
              <span className="logo-mark" aria-hidden="true">Z</span> Zippyfeed
            </p>
            <p className="muted" style={{ maxWidth: 340 }}>
              Kendrapara Packaged Drinking Water. Delivered by the case to homes, offices, shops and events in our local service area.
            </p>
            <p className="xsmall muted mb-0">
              Manufactured by <FactValue fact={legal.manufacturer} /><br />
              Sold by <FactValue fact={legal.seller} /><br />
              FSSAI Lic. No.: <FactValue fact={legal.fssaiLicence} /><br />
              BIS CM/L: <FactValue fact={legal.bisLicence} />
            </p>
          </div>
          <div>
            <h2>Shop & Purity</h2>
            <ul>
              <li><Link href="/shop">All bottle packs</Link></li>
              <li><Link href="/products/zippyfeed-packaged-drinking-water-500ml">500 ml single serve</Link></li>
              <li><Link href="/quality">Quality & Filtration</Link></li>
              <li><Link href="/bulk-orders">Bulk & event quotes</Link></li>
              <li><Link href="/cart">Cart</Link></li>
              <li><Link href="/track">Track your delivery</Link></li>
            </ul>
          </div>
          <div>
            <h2>Resources</h2>
            <ul>
              <li><Link href="/blog">Hydration Blog & News</Link></li>
              <li><Link href="/distributors">Distributor Program</Link></li>
              <li><Link href="/faq">FAQs</Link></li>
              <li><Link href="/contact">Customer Care</Link></li>
              <li><Link href="/policies/shipping">Shipping & delivery</Link></li>
              <li><Link href="/policies/returns">Returns & refunds</Link></li>
            </ul>
          </div>
          <div>
            <h2>Company</h2>
            <ul>
              <li><Link href="/about">About Zippyfeed</Link></li>
              <li><Link href="/policies/privacy">Privacy policy</Link></li>
              <li><Link href="/policies/terms">Terms of sale</Link></li>
              <li><Link href="/unsubscribe">Unsubscribe</Link></li>
            </ul>
            <p className="xsmall muted mt-4 mb-0">
              Phone / WhatsApp: <a href="tel:8637213741" style={{ fontWeight: 700 }}>+91 8637213741</a><br />
              Email: <a href="mailto:abrar@storzen.io">abrar@storzen.io</a>
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Zippyfeed. All prices in INR, inclusive of taxes.</span>
          <span>Store in a cool, dry & hygienic place, away from direct sunlight.</span>
        </div>
      </div>
    </footer>
  );
}
