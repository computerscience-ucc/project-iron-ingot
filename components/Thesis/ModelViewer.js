import { memo, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

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

    el.addEventListener('load', onLoad);
    el.addEventListener('progress', onProgress);
    return () => {
      el.removeEventListener('load', onLoad);
      el.removeEventListener('progress', onProgress);
    };
  }, [mounted, src]); 

  if (!mounted || !src) return null;

  return (
    <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#0a0c10] shadow-xl">
      {/* Header */}
      <div className="px-4 py-2.5 border-b border-white/5 flex items-center gap-2 flex-wrap">
        <span className={`w-2 h-2 rounded-full shrink-0 ${modelLoaded ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`} />
        <span className="text-xs font-semibold text-gray-400 tracking-wide uppercase break-words leading-snug">
          Interactive 3D Model
        </span>
        {!modelLoaded && (
          <span className="text-[10px] text-gray-600 ml-auto shrink-0">{progress}%</span>
        )}
        {modelLoaded && (
          <span className="text-[10px] text-green-600 ml-auto shrink-0">Ready</span>
        )}
      </div>

      {/* Viewer + loading overlay */}
      <div className="relative" style={{ height: '460px' }}>
        {/* Skeleton / loading state */}
        <AnimatePresence>
          {!modelLoaded && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0a0c10] gap-4"
            >
              {/* Spinning 3D cube icon */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="w-12 h-12 rounded-xl border-2 border-red-500/30 border-t-red-500 flex items-center justify-center"
              >
                <svg className="w-5 h-5 text-red-500/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
                </svg>
              </motion.div>
              <div className="flex flex-col items-center gap-1.5">
                <p className="text-xs text-gray-400">Loading 3D model…</p>
                {/* Progress bar */}
                <div className="w-32 h-1 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-red-500/70"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ ease: 'easeOut', duration: 0.3 }}
                  />
                </div>
                <p className="text-[10px] text-gray-600">{progress}%</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* eslint-disable-next-line react/no-unknown-property */}
        <model-viewer
          ref={viewerRef}
          src={src}
          camera-controls
          auto-rotate
          shadow-intensity="1"
          style={{ width: '100%', height: '100%', background: 'transparent', display: 'block' }}
        />
      </div>

      {/* Footer hint */}
      <p className="text-[10px] text-gray-600 text-center py-2 leading-relaxed">
        Drag to orbit · Scroll to zoom · Pinch on mobile
      </p>
    </div>
  );
});

export default ModelViewer;
