import { useState } from "react";
import TopGradient from "@/components/TopGradient";
import IngoLogo from "@/components/IngoLogo";
import SectionStripe from "@/components/SectionStripe";
import Pagination from "@/components/Pagination";
import YearPill from "@/components/YearPill";
import ErrorBoundary from "@/components/ErrorBoundary";

function PaginationDemo() {
  const [page, setPage] = useState(1);
  return <Pagination currentPage={page} totalPages={5} onPageChange={setPage} />;
}

function YearPillDemo() {
  const [sel, setSel] = useState(null);
  return (
    <div className="flex gap-2 flex-wrap">
      {["2023", "2024", "2025"].map((y) => (
        <YearPill key={y} label={y} year={y} selected={sel} onClick={() => setSel(y)} />
      ))}
    </div>
  );
}

const COMPONENTS = [
  {
    name: "TopGradient",
    file: "components/TopGradient.js",
    props: "colorLeft, colorRight",
    description: "Animated radial gradient at top of page that fades on scroll.",
    Demo: () => (
      <div className="relative h-48 rounded overflow-hidden bg-[#0f1218]">
        <TopGradient colorLeft="#007ACC" colorRight="#F92450" />
        <div className="relative z-10 flex items-center justify-center h-full text-white/60 text-sm">
          Scroll-aware gradient &mdash; fades after 75px
        </div>
      </div>
    ),
  },
  {
    name: "IngoLogo",
    file: "components/IngoLogo.js",
    props: "none",
    description: "Animated gradient logo with moving background position.",
    Demo: () => (
      <div className="flex items-center justify-center h-20 bg-[#0f1218] rounded">
        <IngoLogo />
      </div>
    ),
  },
  {
    name: "SectionStripe",
    file: "components/SectionStripe.js",
    props: "className (optional)",
    description: "Decorative horizontal stripe for section separators.",
    Demo: () => <SectionStripe className="!h-12" />,
  },
  {
    name: "Pagination",
    file: "components/Pagination.js",
    props: "currentPage, totalPages, onPageChange, className",
    description: "Page navigation with prev/next buttons and numbered pages.",
    Demo: PaginationDemo,
  },
  {
    name: "YearPill",
    file: "components/YearPill.js",
    props: "label, year, selected, active, onClick",
    description: "Pill-shaped year filter button with active state.",
    Demo: YearPillDemo,
  },
  {
    name: "ErrorBoundary",
    file: "components/ErrorBoundary.js",
    props: "fallback, message, fallbackRender, children",
    description: "React error boundary with retry button.",
    Demo: () => (
      <ErrorBoundary message="Demo error boundary">
        <div className="p-4 bg-[#1a1c23] rounded text-center text-gray-400">
          This content is wrapped in an ErrorBoundary
        </div>
      </ErrorBoundary>
    ),
  },
  {
    name: "FacebookMessenger",
    file: "components/FacebookMessenger.js",
    props: "pageId, appId, className, color, greetingDialogDisplay, greetingDialogDelay",
    description: "Facebook Messenger chat widget (hidden when IDs are placeholders).",
    Demo: () => (
      <div className="p-4 bg-[#1a1c23] rounded text-center text-gray-400">
        Renders FB Customer Chat plugin when valid pageId &amp; appId are provided.
        (Placeholder IDs hide the widget.)
      </div>
    ),
  },
];

export default function DevComponentsPage() {
  const [visibleCode, setVisibleCode] = useState(null);

  return (
    <>
      <TopGradient />
      <div className="min-h-screen bg-[#0f1218] text-[#EFEFEF]">
        <div className="max-w-4xl mx-auto px-5 py-20">
          <h1 className="text-3xl font-bold mb-2">Components Showcase</h1>
          <p className="text-[#8C8C8C] mb-10">
            Visual reference for all shared UI components in <code className="text-red-400">components/</code>
          </p>

          <div className="flex flex-col gap-8">
            {COMPONENTS.map((comp) => (
              <div
                key={comp.name}
                className="border border-[#2A2A2A] rounded-lg overflow-hidden bg-[#12151e]"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h2 className="text-xl font-semibold text-white">{comp.name}</h2>
                      <p className="text-sm text-[#8C8C8C] mt-0.5">
                        <code className="text-blue-400">{comp.file}</code>
                        {" \u2014 "}
                        <span className="text-yellow-400/70">{comp.props}</span>
                      </p>
                    </div>
                    <button
                      onClick={() => setVisibleCode(visibleCode === comp.name ? null : comp.name)}
                      className="text-xs px-3 py-1 rounded bg-[#2A2A2A] hover:bg-[#3A3A3A] transition-colors"
                    >
                      {visibleCode === comp.name ? "Hide Code" : "View Code"}
                    </button>
                  </div>

                  <p className="text-sm text-[#8C8C8C] mb-4">{comp.description}</p>

                  <div className="bg-black/30 rounded p-4 border border-[#2A2A2A]">
                    <comp.Demo />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 p-4 bg-[#1a1c23] rounded border border-[#2A2A2A]">
            <p className="text-sm text-[#8C8C8C]">
              <strong className="text-white">Layout components</strong> are in{" "}
              <code className="text-blue-400">layouts/</code> (AwardGallery, Council, Hero, FAQ, etc.)<br />
              <strong className="text-white">Card components</strong> are in{" "}
              <code className="text-blue-400">components/Card/</code> (Blog, Bulletin, Thesis, Gallery)<br />
              <strong className="text-white">Radix UI primitives</strong> are in{" "}
              <code className="text-blue-400">components/ui/</code> (button, input, navigation-menu)<br />
              <strong className="text-white">Feature components</strong> are in{" "}
              <code className="text-blue-400">components/[Feature]/</code> (About, Awards, Home, Team, Thesis/)
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
