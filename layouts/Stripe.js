export default function Stripe({ className }) {
  return (
    <div className={`w-full relative h-[1px] overflow-hidden ${className ?? "mt-[6rem] mb-[4rem]"}`}>
      <div className="absolute top-0 left-0 w-full border-dashed-long-h text-[#2A2A2A]"></div>
    </div>
  );
}
