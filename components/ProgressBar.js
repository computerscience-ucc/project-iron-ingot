import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function ProgressBar() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timer;
    let progressTimer;

    const handleStart = (url) => {
      if (url === router.asPath) return;
      setLoading(true);
      setProgress(0);
    };

    const handleComplete = () => {
      setProgress(100);
      timer = setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 300);
    };

    const handleError = () => {
      setLoading(false);
      setProgress(0);
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleError);

    if (loading && progress < 90) {
      progressTimer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev;
          const diff = 90 - prev;
          const factor = Math.random() * 0.3;
          return prev + diff * factor;
        });
      }, 300);
    }

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleError);
      clearTimeout(timer);
      clearInterval(progressTimer);
    };
  }, [router, loading, progress]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="fixed top-0 left-0 right-0 z-[9999] h-[3px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="h-full bg-[#EA2B2E]"
            style={{
              boxShadow: "0 0 10px rgba(234,43,46,0.5), 0 0 5px rgba(234,43,46,0.3)",
            }}
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
          {/* Glow effect */}
          <motion.div
            className="absolute top-0 right-0 h-full w-[100px]"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(234,43,46,0.6), transparent)",
              filter: "blur(4px)",
            }}
            animate={{ x: ["-100px", "0px"] }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
