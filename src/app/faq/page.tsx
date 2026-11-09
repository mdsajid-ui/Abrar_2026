import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: "Find answers regarding Zippyfeed packaged drinking water, case sizes, local delivery, returns, and bulk ordering.",
};

export default function FAQPage() {
  const faqs = [
    {
      q: "What is the price of Zippyfeed Packaged Drinking Water?",
      a: "Each 500ml bottle has an official Maximum Retail Price (MRP) of ₹10, inclusive of all taxes. Our cases are sold at direct MRP multiples (e.g. 12-pack for ₹120, 24-pack for ₹240, 48-pack for ₹480).",
    },
    {
      q: "Which areas do you deliver to?",
      a: "We currently provide localized doorstep delivery within Kendrapara, Thakurpatna, and surrounding PIN codes (such as 754211 and 754250). You can check your specific PIN code on our homepage delivery tool.",
    },
    {
      q: "How fast is doorstep delivery?",
      a: "Orders placed before 1:00 PM are typically delivered the same day or early the following morning. For scheduled recurring office drops, deliveries arrive on your pre-selected weekday.",
    },
    {
      q: "Can I pay Cash on Delivery (COD)?",
      a: "Yes! We accept Cash on Delivery as well as instant UPI scans directly to our delivery personnel upon receipt of your crates.",
    },
    {
      q: "What if a bottle in my case is damaged or leaking upon arrival?",
      a: "We inspect every carton prior to vehicle loading. However, if any bottle is punctured, damaged, or unsealed during transit, point it out to the driver or notify us within 24 hours for an immediate free replacement or refund credit.",
    },
    {
      q: "Do you supply water for weddings, receptions, and large parties?",
      a: "Absolutely! We supply hundreds of cases weekly for events, festivals, and celebrations in Kendrapara. Head over to our Bulk & Events page to receive discounted institutional rates.",
    },
  ];

  return (
    <div className="section">
      <div className="container container-narrow">
        <div className="breadcrumbs">
          <ol>
            <li><Link href="/">Home</Link></li>
            <li>FAQ</li>
          </ol>
        </div>

        <div className="section-head">
          <span className="eyebrow">Customer Support</span>
          <h1>Frequently Asked Questions</h1>
          <p className="lead muted">
            Clear information about ordering, case packaging, mineral content, and delivery timelines.
          </p>
        </div>

        <div className="faq mb-8">
          {faqs.map((f, i) => (
            <details key={i} open={i === 0}>
              <summary>{f.q}</summary>
              <div className="ans">{f.a}</div>
            </details>
          ))}
        </div>

        <div className="card card-flat center">
          <h3>Still have a question?</h3>
          <p className="small muted mb-4">Our support team is happy to help you with custom queries.</p>
          <Link href="/contact" className="btn btn-primary btn-sm">
            Reach Out to Customer Care
          </Link>
        </div>
      </div>
    </div>
  );
}
