"use client";
import { useSearchParams } from "next/navigation";
import { Gallery } from "./gallery";
import { ConsultationForm } from "./consultation-form";
export function PortfolioQuery() {
  const p = useSearchParams();
  return <Gallery initialCategory={p.get("category") || undefined} initialWork={p.get("work") || undefined} />;
}
export function ContactQuery() {
  const p = useSearchParams();
  return <ConsultationForm initialService={p.get("service")?.slice(0,120)} initialPlan={p.get("plan")?.slice(0,60)} />;
}
