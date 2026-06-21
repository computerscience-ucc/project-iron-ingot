import { cn } from "@/lib/utils";

export default function SectionStripe({ className }) {
  return (
    <div className={cn("w-full relative h-[3.2rem] overflow-hidden", className)}>
      <div className="stripe-banner absolute inset-0 z-0"></div>
      <div className="absolute top-0 left-0 w-full border-dashed-long-h text-[#2A2A2A]"></div>
      <div className="absolute bottom-0 left-0 w-full border-dashed-long-h text-[#2A2A2A]"></div>
    </div>
  );
}
