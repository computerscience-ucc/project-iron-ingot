import Link from "next/link";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

const glitchChars = "!@#$%^&*()_+-=[]{}|;':\",./<>?`~";
const terminalLines = [
  "[SYSTEM] Scanning filesystem...",
  "[SYSTEM] Route not found in lookup table",
  "[ERROR]  PAGE_NOT_FOUND: null reference",
  "[SYSTEM] Attempting to locate backup...",
  "[SYSTEM] No redirect configured for this path",
  "[INFO]   Initiating safe fallback protocol",
];

function GlitchText({ text, className = "" }) {
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    let interval;
    const glitch = () => {
      const arr = text.split("");
      const idx = Math.floor(Math.random() * arr.length);
      arr[idx] = glitchChars[Math.floor(Math.random() * glitchChars.length)];
      setDisplay(arr.join(""));
      setTimeout(() => setDisplay(text), 80);
    };
    interval = setInterval(glitch, 3000 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, [text]);

  return <span className={className}>{display}</span>;
}

export default function Custom404() {
  const [showLines, setShowLines] = useState(0);

  useEffect(() => {
    const timers = terminalLines.map((_, i) =>
      setTimeout(() => setShowLines(i + 1), 800 + i * 600)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] overflow-hidden font-mono">
      {/* Scanline overlay */}
      <div className="pointer-events-none fixed inset-0 z-50">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.3) 1px, rgba(0,0,0,0.3) 2px)",
            backgroundSize: "100% 4px",
          }}
        />
        {/* Scanning beam */}
        <motion.div
          className="absolute left-0 right-0 h-[200px]"
          style={{
            background:
              "linear-gradient(0deg, transparent 0%, rgba(234,43,46,0.06) 40%, rgba(234,43,46,0.12) 50%, rgba(234,43,46,0.06) 60%, transparent 100%)",
          }}
          animate={{ y: ["-200px", "calc(100vh + 200px)"] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Noise texture */}
      <div
        className="pointer-events-none fixed inset-0 z-40 opacity-[0.015]"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: "128px 128px",
        }}
      />

      {/* Vignette */}
      <div
        className="pointer-events-none fixed inset-0 z-30"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 0%, transparent 50%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      {/* Main content */}
      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4 py-12">
        {/* Terminal window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-2xl"
        >
          {/* Terminal header bar */}
          <div className="flex items-center gap-2 px-4 py-3 bg-[#1a1a1a] border border-[#333] border-b-0 rounded-t-lg">
            <div className="w-3 h-3 rounded-full bg-[#FF5154]" />
            <div className="w-3 h-3 rounded-full bg-[#FFB800]" />
            <div className="w-3 h-3 rounded-full bg-[#00C853]" />
            <span className="ml-3 text-[0.7rem] text-[#666] uppercase tracking-widest">
              terminal — bash
            </span>
          </div>

          {/* Terminal body */}
          <div className="bg-[#0d0d0d] border border-[#333] border-t-0 rounded-b-lg p-6 md:p-8 lg:p-10">
            {/* Error code */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mb-6"
            >
              <h1 className="text-[3rem] md:text-[4rem] lg:text-[5rem] font-bold leading-none tracking-tight font-minecraft text-white">
                <GlitchText text="ERROR" className="text-[#FF5154]" />{" "}
                <span className="text-white">404</span>
              </h1>
            </motion.div>

            {/* Terminal output lines */}
            <div className="space-y-2 text-[0.8rem] md:text-[0.9rem] lg:text-[1rem] text-[#EA2B2E]/80 mb-8">
              {terminalLines.slice(0, showLines).map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex"
                  style={{
                    textShadow: "0 0 8px rgba(234,43,46,0.4)",
                  }}
                >
                  <span className="text-[#FF5154] mr-2 select-none">&gt;</span>
                  <span>{line}</span>
                </motion.div>
              ))}
            </div>

            {/* Main message */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 4.5, duration: 0.5 }}
              className="mb-8"
            >
              <p
                className="text-[0.9rem] md:text-[1rem] lg:text-[1.1rem] text-[#888] leading-relaxed mb-4"
                style={{ textShadow: "0 0 1px rgba(255,255,255,0.1)" }}
              >
                The page you are looking for might have been removed, had its
                name changed, or is temporarily unavailable.
              </p>
              <p
                className="text-[0.9rem] md:text-[1rem] lg:text-[1.1rem] text-[#888] leading-relaxed"
                style={{ textShadow: "0 0 1px rgba(255,255,255,0.1)" }}
              >
                <span className="text-[#FF5154]">Good luck.</span>
              </p>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 5.2, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                href="/"
                className="group relative px-6 py-3 bg-[#EA2B2E] text-white text-[0.9rem] font-medium tracking-wide hover:bg-[#FF5154] transition-all duration-300 overflow-hidden"
                style={{
                  clipPath:
                    "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
                }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <span className="text-[#FFB800] font-minecraft">[</span>
                  RETURN HOME
                  <span className="text-[#FFB800] font-minecraft">]</span>
                </span>
                <div className="absolute inset-0 bg-[#FF5154] translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-300" />
              </Link>

              <Link
                href="/thesis"
                className="group relative px-6 py-3 border border-[#333] text-[#888] text-[0.9rem] font-medium tracking-wide hover:border-[#EA2B2E] hover:text-[#EA2B2E] transition-all duration-300 overflow-hidden"
                style={{
                  clipPath:
                    "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
                }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <span className="text-[#FFB800] font-minecraft">[</span>
                  BROWSE THESIS
                  <span className="text-[#FFB800] font-minecraft">]</span>
                </span>
              </Link>
            </motion.div>

            {/* Blinking cursor */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 5.8, duration: 0.3 }}
              className="mt-8 text-[#EA2B2E]/60 text-[0.8rem]"
            >
              <span className="font-minecraft">$</span>{" "}
              <span className="animate-pulse">_</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Decorative corner brackets */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          transition={{ delay: 1, duration: 1 }}
          className="fixed top-8 left-8 text-[#EA2B2E] text-4xl font-minecraft pointer-events-none select-none hidden md:block"
        >
          [
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="fixed bottom-8 right-8 text-[#EA2B2E] text-4xl font-minecraft pointer-events-none select-none hidden md:block"
        >
          ]
        </motion.div>
      </div>
    </div>
  );
}
