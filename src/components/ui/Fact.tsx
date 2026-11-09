import type { Fact } from "@/config/business";

/** Renders a verified business fact, or an unmistakable "pending" badge when not yet supplied. */
export function FactValue({ fact, fallback = "To be added" }: { fact: Fact; fallback?: string }) {
  if (fact.value && fact.verified) return <>{fact.value}</>;
  if (fact.value)
    return (
      <>
        {fact.value} <span className="pending" title={fact.note ?? "Placeholder — confirm with business"}>to confirm</span>
      </>
    );
  return <span className="pending" title={fact.note}>{fallback}</span>;
}

export function Pending({ children = "Placeholder" }: { children?: React.ReactNode }) {
  return <span className="pending">{children}</span>;
}
