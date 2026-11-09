"use client";

import Link from "next/link";
import { IconBox, IconTruck, IconCheck, IconDrop } from "@/components/ui/Icons";

interface HeroCardItem {
  id: string;
  badge: string;
  badgeColor?: "aqua" | "green" | "red" | "dark";
  title: string;
  subtitle: string;
  price: string;
  unitPrice: string;
  href: string;
  icon: "bottle" | "truck" | "box" | "drop";
}

const HERO_CARDS: HeroCardItem[] = [
  {
    id: "case-24",
    badge: "Most Popular",
    badgeColor: "green",
    title: "Case of 24 Bottles",
    subtitle: "500 ml • Daily Home & Café Hydration",
    price: "₹240",
    unitPrice: "₹10 / bottle",
    href: "/shop",
    icon: "bottle",
  },
  {
    id: "case-48",
    badge: "Free Doorstep Delivery",
    badgeColor: "aqua",
    title: "2 Cases (48 Bottles)",
    subtitle: "500 ml • Offices, Meetings & Pantries",
    price: "₹480",
    unitPrice: "₹10 / bottle",
    href: "/shop",
    icon: "box",
  },
  {
    id: "case-12",
    badge: "Compact Pack",
    badgeColor: "dark",
    title: "Case of 12 Bottles",
    subtitle: "500 ml • Study Desks, Gym & Travel",
    price: "₹120",
    unitPrice: "₹10 / bottle",
    href: "/shop",
    icon: "bottle",
  },
  {
    id: "bulk-supply",
    badge: "Institutional B2B",
    badgeColor: "red",
    title: "Bulk & Celebration Supply",
    subtitle: "50+ Cases • Marriage Halls & Drops",
    price: "Tiered Quotes",
    unitPrice: "Wholesale Margin",
    href: "/bulk-orders",
    icon: "truck",
  },
];

export function HeroProductCards() {
  return (
    <div className="hero-cards-wrapper">
      <div className="hero-cards-container">
        {HERO_CARDS.map((card) => (
          <Link
            key={card.id}
            href={card.href}
            className="hero-glass-card"
            aria-label={`${card.title} - ${card.price}`}
          >
            <div className="hero-card-header">
              <span className={`hero-micro-badge badge-${card.badgeColor || "aqua"}`}>
                {card.badge}
              </span>
              <span className="hero-card-arrow" aria-hidden="true">↗</span>
            </div>

            <div className="hero-card-body">
              <h3 className="hero-card-title">{card.title}</h3>
              <p className="hero-card-subtitle">{card.subtitle}</p>
            </div>

            <div className="hero-card-footer">
              <div className="hero-card-price-group">
                <span className="hero-card-price">{card.price}</span>
                <span className="hero-card-unit">{card.unitPrice}</span>
              </div>
              <div className="hero-card-icon-pill">
                {card.icon === "box" && <IconBox size={16} />}
                {card.icon === "truck" && <IconTruck size={16} />}
                {card.icon === "bottle" && <IconDrop size={16} />}
                {card.icon === "drop" && <IconDrop size={16} />}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
