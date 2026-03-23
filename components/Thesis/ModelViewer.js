import { memo, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Module-level session cache
const _modelSessionCache = new Map();

const ModelViewer = memo(function ModelViewer({ src }) {
  const alreadyLoaded = _modelSessionCache.has(src);
  const [mounted, setMounted] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(alreadyLoaded);
  const [progress, setProgress] = useState(alreadyLoaded ? 100 : 0);
  const viewerRef = useRef(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const el = viewerRef.current;
    if (!el) return;

    const onLoad = () => {
      _modelSessionCache.set(src, true);
      setModelLoaded(true);
    };
    const onProgress = (e) => {
      const pct = Math.round((e.detail?.totalProgress ?? 0) * 100);
      setProgress(pct);
    };

    el.addEventListener("load", onLoad);
    el.addEventListener("progress", onProgress);
    return () => {
      el.removeEventListener("load", onLoad);
      el.removeEventListener("progress", onProgress);
    };
  }, [mounted, src]);

  if (!mounted || !src) return null;

  return (
    <div className="relative">
      {/* Header */}
      <div className="pt-0 pb-6">
        <h3 className="text-[1.125rem] md:text-[1.25rem] font-semibold text-[#EFEFEF] tracking-normal leading-[1.3]">
          Interactive 3D Model
        </h3>
      </div>

      {/* Viewer + loading overlay */}
      <div className="relative overflow-hidden aspect-[16/10] md:aspect-video">
        {/* Skeleton / loading state */}
        <AnimatePresence>
          {!modelLoaded && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#181818] gap-4"
            >
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-32 h-1 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-red-500/70"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ ease: "easeOut", duration: 0.3 }}
                  />
                </div>
                <p className="text-[1rem] text-gray-600 font-normal">{progress}%</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <model-viewer
          ref={viewerRef}
          src={src}
          camera-controls
          auto-rotate
          shadow-intensity="1"
          style={{ width: "100%", height: "100%", background: "transparent", display: "block" }}
        />
      </div>

      {/* Footer Status & Hint */}
      <div className="flex flex-col items-center pt-4 pb-2">
        <div className="flex items-center gap-2 mb-1.5">
          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${modelLoaded ? "bg-[#10B981]" : "bg-[#EF4444] animate-pulse"}`} />
          {modelLoaded ? (
            <span className="text-[1rem] text-[#8C8C8C] font-normal leading-relaxed">Ready</span>
          ) : (
            <span className="text-[1rem] text-[#8C8C8C] font-normal leading-relaxed">Loading ({progress}%)</span>
          )}
        </div>
        <p className="text-[1rem] text-[#8C8C8C] text-center leading-relaxed font-normal opacity-60">
          Drag to orbit · Scroll to zoom · Pinch on mobile
        </p>
      </div>
    </div>
  );
});

export default ModelViewer;
