import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/router";
import { useState, useEffect, useRef, useCallback } from "react";

export default function ProgressBar() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(null);
  const hideTimerRef = useRef(null);

  const reset = useCallback(() => {
    clearInterval(progressRef.current);
    clearTimeout(hideTimerRef.current);
    progressRef.current = null;
    hideTimerRef.current = null;
  }, []);

  const hide = useCallback(() => {
    setProgress(100);
    hideTimerRef.current = setTimeout(() => {
      setLoading(false);
      setProgress(0);
    }, 400);
  }, []);

  useEffect(() => {
    const handleStart = () => {
      reset();
      setLoading(true);
      setProgress(0);

      progressRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev;
          const diff = 90 - prev;
          return prev + diff * (Math.random() * 0.3);
        });
      }, 400);
    };

    const handleComplete = () => {
      clearInterval(progressRef.current);
      progressRef.current = null;
      hide();
    };

    const handleError = () => {
      reset();
      setLoading(false);
      setProgress(0);
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleError);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleError);
      reset();
    };
  }, [router, reset, hide]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="fixed top-0 left-0 right-0 z-[9999] h-[3px] bg-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <motion.div
            className="h-full bg-[#EA2B2E] origin-left"
            style={{
              boxShadow:
                "0 0 10px rgba(234,43,46,0.5), 0 0 5px rgba(234,43,46,0.3)",
            }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: progress / 100 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
