import { AnimatePresence, motion } from 'framer-motion';
import { CgChevronLeft, CgChevronRight, CgChevronUp } from 'react-icons/cg';
import { AiFillLinkedin, AiOutlineGlobal } from 'react-icons/ai';
import { useCallback, useEffect, useRef, useState, memo } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
import { PortableText } from '@portabletext/react';
import { _Transition_Page } from '../../components/_Animations';
import { client } from '../../components/Prefetcher';
import dayjs from 'dayjs';
import urlBuilder from '@sanity/image-url';

const urlFor = (source) =>
  urlBuilder({ projectId: 'gjvp776o', dataset: 'production' }).image(source);

function getYouTubeId(url) {
  if (!url) return null;
  const m = url.match(/(?:youtu\.be\/|[?&]v=)([^&?/\s]{11})/);
  return m ? m[1] : null;
}

function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
}

const blockComponents = {
  types: {
    image: ({ value }) => (
      <div className="relative w-full h-[300px] my-4">
        <Image src={urlFor(value.asset).url()} layout="fill" objectFit="contain" alt={value.alt || ''} />
      </div>
    ),
  },
  block: {
    h1: ({ children }) => <h1 className="text-4xl font-bold mt-6 mb-2">{children}</h1>,
    h2: ({ children }) => <h2 className="text-3xl font-bold mt-5 mb-2">{children}</h2>,
    h3: ({ children }) => <h3 className="text-2xl font-bold mt-4 mb-1">{children}</h3>,
    h4: ({ children }) => <h4 className="text-xl font-bold mt-3 mb-1">{children}</h4>,
    normal: ({ children }) => <p className="leading-relaxed mb-3 text-gray-300">{children}</p>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-red-600 pl-4 my-4 italic text-gray-400">{children}</blockquote>
    ),
  },
  marks: {
    em: ({ children }) => <em className="italic text-gray-300">{children}</em>,
    strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
    link: ({ children, value }) => (
      <a href={value.href} target="_blank" rel="noopener noreferrer"
        className="underline underline-offset-4 text-blue-400 hover:text-blue-300 transition">
        {children}
      </a>
    ),
  },
};

// ─────────────────────
// Materials list
// ─────────────────────
const MATERIAL_ICONS = {
  document: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  github: (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  ),
  dataset: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
    </svg>
  ),
  video: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
    </svg>
  ),
  other: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  ),
};

const MaterialsList = ({ materials }) => {
  if (!materials || materials.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-600 gap-2">
        <svg className="w-8 h-8 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
        <p className="text-sm">No materials listed yet.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {materials.map((m, i) => (
        <a
          key={i}
          href={m.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-4 px-4 py-3.5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-red-500/40 hover:bg-white/[0.06] transition-all"
        >
          <div className="w-9 h-9 rounded-lg bg-red-600/10 flex items-center justify-center text-red-400 group-hover:bg-red-600/20 transition-colors shrink-0 self-center">
            {MATERIAL_ICONS[m.icon] || MATERIAL_ICONS.other}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white group-hover:text-red-300 transition-colors leading-tight">{m.label}</p>
            <p className="text-[11px] text-gray-600 truncate mt-0.5">{m.url}</p>
          </div>
          <svg className="w-4 h-4 text-gray-600 group-hover:text-red-400 transition-colors shrink-0 self-center" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      ))}
    </div>
  );
};

// ─────────────────────────────────────────────────────
// Hero Carousel (images + optional YouTube tab)
// ─────────────────────────────────────────────────────
const HeroCarousel = ({ images, youtubeId }) => {
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1);
  const [tab, setTab] = useState('photos');
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  const hasImages = images && images.length > 0;
  const hasVideo = !!youtubeId;

  const go = useCallback((d) => {
    if (!hasImages || images.length < 2) return;
    setDir(d);
    setIdx((i) => (i + d + images.length) % images.length);
  }, [hasImages, images]);

  useEffect(() => {
    if (paused || tab !== 'photos' || !hasImages || images.length < 2) return;
    timerRef.current = setInterval(() => go(1), 4000);
    return () => clearInterval(timerRef.current);
  }, [paused, tab, hasImages, images, go]);

  const slideVariants = {
    enter: (d) => ({ x: d > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit:  (d) => ({ x: d > 0 ? -60 : 60, opacity: 0 }),
  };

  if (!hasImages && !hasVideo) return null;

  return (
    <div
      className="w-full rounded-2xl overflow-hidden bg-black border border-white/5 mb-8"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Tab bar — only shown when both exist */}
      {hasImages && hasVideo && (
        <div className="flex border-b border-white/10">
          {['photos', 'video'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2.5 text-xs font-semibold uppercase tracking-widest transition-colors ${
                tab === t
                  ? 'text-white border-b-2 border-red-500'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {t === 'photos' ? `Photos (${images.length})` : 'Video'}
            </button>
          ))}
        </div>
      )}

      {/* Photos */}
      {tab === 'photos' && hasImages && (
        <div className="relative w-full" style={{ height: '420px' }}>
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={idx}
              custom={dir}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="absolute inset-0"
            >
              <Image
                src={images[idx]}
                layout="fill"
                objectFit="cover"
                alt={`Photo ${idx + 1}`}
                priority={idx === 0}
              />
            </motion.div>
          </AnimatePresence>

          {images.length > 1 && (
            <>
              <button onClick={() => go(-1)}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white transition">
                <CgChevronLeft size={22} />
              </button>
              <button onClick={() => go(1)}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white transition">
                <CgChevronRight size={22} />
              </button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setDir(i > idx ? 1 : -1); setIdx(i); }}
                    className={`h-1.5 rounded-full transition-all ${
                      i === idx ? 'bg-white w-5' : 'bg-white/40 w-1.5 hover:bg-white/70'
                    }`}
                  />
                ))}
              </div>
              <span className="absolute top-3 right-3 z-10 text-[11px] px-2 py-0.5 rounded-full bg-black/60 text-gray-300">
                {idx + 1} / {images.length}
              </span>
            </>
          )}
        </div>
      )}

      {/* Video — shown when tab=video OR only video exists */}
      {(tab === 'video' || (!hasImages && hasVideo)) && (
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1`}
            title="Thesis Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────
// Member avatar strip
// ─────────────────────────────────────────────────────
const MemberCard = ({ member }) => {
  const [hovered, setHovered] = useState(false);
  const link = member.linkedIn || member.website || null;
  const photoUrl = typeof member.photo === 'string'
    ? member.photo
    : member.photo?.asset?.url || null;

  const inner = (
    <div
      className="relative flex flex-col items-center cursor-pointer group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Avatar circle */}
      <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-red-500/60 transition-all shadow-md bg-[#1a1d24] flex items-center justify-center shrink-0">
        {photoUrl ? (
          <Image src={photoUrl} layout="fill" objectFit="cover" alt={member.fullName} />
        ) : (
          <span className="text-sm font-bold text-gray-300">{getInitials(member.fullName)}</span>
        )}
      </div>

      {/* Social icon badge */}
      {link && (
        <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#0e1015] border border-white/10 flex items-center justify-center">
          {member.linkedIn
            ? <AiFillLinkedin size={10} className="text-blue-400" />
            : <AiOutlineGlobal size={10} className="text-green-400" />}
        </span>
      )}

      {/* Hover tooltip */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.12 }}
            className="absolute top-14 z-20 bg-[#1a1d24] border border-white/10 rounded-xl px-3 py-2 shadow-xl whitespace-nowrap pointer-events-none"
          >
            <p className="text-xs font-semibold text-gray-100">{member.fullName}</p>
            {member.section && <p className="text-[10px] text-gray-500 mt-0.5">{member.section}</p>}
            {link && (
              <p className="text-[9px] text-red-400 mt-1">
                {member.linkedIn ? 'LinkedIn' : 'Website'} →
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return link
    ? <a href={link} target="_blank" rel="noopener noreferrer">{inner}</a>
    : <div>{inner}</div>;
};

const MemberStrip = ({ members }) => {
  if (!members || members.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-5 items-start mb-10 px-1">
      {members.map((m, i) => <MemberCard key={i} member={m} />)}
    </div>
  );
};

// ─────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────
// 3D Model Viewer  (client-only — <model-viewer> web component)
// ─────────────────────────────────────────────────────

// Module-level session cache: tracks which model URLs have already been fully
// loaded this tab session. Keyed by the Sanity asset URL, which is content-
// addressed (SHA1 hash in path), so a newly published model always has a
// different URL and correctly bypasses the cache.
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
      _modelSessionCache.set(src, true); // remember for this session
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
  }, [mounted, src]); // re-attach once mounted so viewerRef.current is the real element

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

// ─────────────────────────────────────────────────────
// Showcase image gallery — right-panel fallback when no 3D model
// ─────────────────────────────────────────────────────
const ShowcaseGallery = ({ images }) => {
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1);

  const go = (d) => {
    setDir(d);
    setIdx((i) => (i + d + images.length) % images.length);
  };

  const slideVariants = {
    enter: (d) => ({ x: d > 0 ? 40 : -40, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit:  (d) => ({ x: d > 0 ? -40 : 40, opacity: 0 }),
  };

  return (
    <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#0a0c10] shadow-xl">
      {/* Header */}
      <div className="px-4 py-2.5 border-b border-white/5 flex items-center gap-2 flex-wrap">
        <svg className="w-3.5 h-3.5 text-gray-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span className="text-xs font-semibold text-gray-400 tracking-wide uppercase break-words leading-snug">
          Project Showcase
        </span>
        <span className="text-[10px] text-gray-600 ml-auto shrink-0">
          {idx + 1} / {images.length}
        </span>
      </div>

      {/* Main image */}
      <div className="relative bg-black overflow-hidden" style={{ height: '320px' }}>
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={idx}
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="absolute inset-0"
          >
            <Image
              src={images[idx]}
              layout="fill"
              objectFit="contain"
              alt={`Showcase ${idx + 1}`}
            />
          </motion.div>
        </AnimatePresence>

        {images.length > 1 && (
          <>
            <button onClick={() => go(-1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full bg-black/60 hover:bg-black/90 text-white transition">
              <CgChevronLeft size={18} />
            </button>
            <button onClick={() => go(1)}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full bg-black/60 hover:bg-black/90 text-white transition">
              <CgChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="flex gap-1.5 px-3 py-2.5 overflow-x-auto bg-[#080a0e] border-t border-white/5">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => { setDir(i > idx ? 1 : -1); setIdx(i); }}
              className={`shrink-0 w-12 h-9 rounded-md overflow-hidden border-2 transition-all ${
                i === idx ? 'border-red-500 opacity-100' : 'border-transparent opacity-35 hover:opacity-70'
              }`}
            >
              <Image src={img} width={48} height={36} objectFit="cover" alt={`thumb-${i}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Right panel — shows 3D model, image showcase, or a tab-switcher if both exist
// ─────────────────────────────────────────────────────────────────────────────
const RightPanel = ({ model3d, showcase }) => {
  const hasModel   = !!model3d;
  const hasImages  = showcase && showcase.length > 0;
  const hasBoth    = hasModel && hasImages;
  const [tab, setTab] = useState(hasModel ? 'model' : 'images');

  if (!hasModel && !hasImages) return null;

  return (
    <div className="sticky top-24 flex flex-col gap-2">
      {/* Tab bar — only when both exist */}
      {hasBoth && (
        <div className="flex gap-1 p-1 bg-[#0a0c10] rounded-xl border border-white/5">
          {[{ id: 'model', label: '3D Model', icon: '⬡' }, { id: 'images', label: 'Showcase', icon: '⊞' }].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                tab === t.id
                  ? 'bg-red-600/90 text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <span className="text-[10px] leading-none">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      <AnimatePresence mode="wait">
        {(!hasBoth || tab === 'model') && hasModel && (
          <motion.div
            key="model"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
          >
            <ModelViewer src={model3d} />
          </motion.div>
        )}
        {(!hasBoth || tab === 'images') && hasImages && (
          <motion.div
            key="images"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
          >
            <ShowcaseGallery images={showcase} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const DEPT_LABEL = {
  CS: 'Computer Science',
  IT: 'Information Technology',
  IS: 'Information Systems',
  EMC: 'Entertainment & Multimedia Computing',
  Other: 'General / Other',
};

export const getStaticPaths = async () => {
  const posts = await client.fetch(`*[_type == "thesis"]{ "slug": slug.current }`);
  return {
    paths: posts.map((p) => ({ params: { slug: p.slug } })),
    fallback: 'blocking',
  };
};

export const getStaticProps = async ({ params }) => {
  const { slug } = params;
  const post = await client.fetch(
    `*[_type == "thesis" && slug.current == $slug]{
      _id, _createdAt, _type,
      "title": thesisTitle,
      "slug": slug.current,
      "headerImage": headerImage.asset->url,
      "images": thesisImages[].asset->url,
      "showcase": showcaseImages[].asset->url,
      "model3d": threeDModel.asset->url,
      youtubeLink,
      "authors": postAuthor[]->{
        fullName, pronouns,
        "authorPhoto": authorPhoto.asset->url,
        yearLevel, batchYear
      },
      "owners": ownersInformation,
      "members": thesisMembers[]{
        fullName, section, linkedIn, website,
        "photo": photo.asset->url
      },
      "materials": materials[]{ label, url, icon },
      academicYear, department, tags,
      "content": thesisContent
    }[0]`,
    { slug }
  );
  if (!post) return { notFound: true };
  return { props: { post }, revalidate: 10 };
};

const ThesisPage = ({ post }) => {
  const mainRef = useRef(null);
  const [scrollTop, setScrollTop] = useState(false);
  const [leftTab, setLeftTab] = useState('abstract');

  useEffect(() => {
    window.scrollTo(0, 0);
    const onScroll = () => {
      const h = mainRef.current?.scrollHeight || 0;
      setScrollTop(window.scrollY > h * 0.15 && window.scrollY < h - 700);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!post) return null;

  const youtubeId = getYouTubeId(post.youtubeLink);
  const hasCarousel = (post.images && post.images.length > 0) || !!youtubeId;
  const hasModel    = !!post.model3d;
  const hasShowcase  = !!(post.showcase && post.showcase.length > 0);
  const hasRightPanel = hasModel || hasShowcase;

  return (
    <>
      <Head>
        <title>{post.title} | Ingo</title>
        <meta name="description" content={post.title} />
      </Head>

      {/* Load Google model-viewer script only when needed */}
      {hasModel && (
        <Script
          type="module"
          src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"
          strategy="lazyOnload"
        />
      )}

      <motion.main
        ref={mainRef}
        variants={_Transition_Page}
        initial="initial"
        animate="animate"
        exit="exit"
        className="min-h-screen pt-36 pb-24"
      >
        {/* ── Back + Title ── */}
        <div className="mb-8">
          <Link href="/thesis" scroll={false}>
            <a className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-red-400 transition mb-5">
              <CgChevronLeft size={18} />
              Back to Thesis
            </a>
          </Link>

          {/* Meta badges */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {post.academicYear && (
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-red-600/20 text-red-400 border border-red-600/30 font-semibold">
                {post.academicYear}
              </span>
            )}
            {post.department && (
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/5 text-gray-400 border border-white/10">
                {DEPT_LABEL[post.department] || post.department}
              </span>
            )}
            {post._createdAt && (
              <span className="text-[11px] text-gray-600 ml-auto">
                {dayjs(post._createdAt).format('MMMM D, YYYY')}
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-white mb-4">
            {post.title}
          </h1>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {post.tags.map((tag, i) => (
                <span key={i} className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#1a1d24] text-gray-400 border border-white/5">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* ── Hero Carousel ── */}
        {hasCarousel && <HeroCarousel images={post.images || []} youtubeId={youtubeId} />}

        {/* ── Member Strip (new thesisMembers field) ── */}
        {post.members && post.members.length > 0 && (
          <MemberStrip members={post.members} />
        )}

        {/* Fallback: legacy ownerFullname list */}
        {(!post.members || post.members.length === 0) && post.owners?.ownerFullname?.length > 0 && (
          <div className="mb-8">
            <p className="text-xs text-gray-600 uppercase tracking-wider mb-1.5">Thesis Authors</p>
            <p className="text-sm text-gray-300">
              {post.owners.ownerSection && (
                <span className="text-red-400 mr-2">({post.owners.ownerSection})</span>
              )}
              {post.owners.ownerFullname.join(', ')}
            </p>
          </div>
        )}

        <hr className="border-white/5 mb-10" />

        {/* ── Two-column: Content | 3D Model or Showcase ── */}
        <div className={hasRightPanel ? 'grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10 items-start' : ''}>
          {/* Left: Tabs + content */}
          <div className="flex flex-col gap-4">
            {/* Tab switcher */}
            <div className="flex gap-1 p-1 bg-[#0a0c10] rounded-xl border border-white/5 w-fit">
              <button
                onClick={() => setLeftTab('abstract')}
                className={`px-5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  leftTab === 'abstract'
                    ? 'bg-red-600/90 text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                Abstract
              </button>
              {post.materials && post.materials.length > 0 && (
                <button
                  onClick={() => setLeftTab('materials')}
                  className={`flex items-center gap-1.5 px-5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    leftTab === 'materials'
                      ? 'bg-red-600/90 text-white shadow-sm'
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  Materials
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/10">{post.materials.length}</span>
                </button>
              )}
            </div>

            {/* Tab content */}
            <AnimatePresence mode="wait">
              {leftTab === 'abstract' && (
                <motion.div
                  key="abstract"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18 }}
                >
                  {post.content ? (
                    <PortableText value={post.content} components={blockComponents} />
                  ) : (
                    <p className="text-gray-500 italic">No content available yet.</p>
                  )}
                </motion.div>
              )}
              {leftTab === 'materials' && (
                <motion.div
                  key="materials"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18 }}
                >
                  <MaterialsList materials={post.materials} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right: 3D model, image showcase, or tab-switcher if both */}
          {hasRightPanel && (
            <RightPanel model3d={post.model3d} showcase={post.showcase} />
          )}
        </div>

        {/* ── Posted-by credit ── */}
        {post.authors && post.authors.length > 0 && (
          <div className="mt-12 pt-6 border-t border-white/5">
            <p className="text-xs text-gray-600 uppercase tracking-wider mb-1">Posted by</p>
            <p className="text-sm text-gray-400">
              {post.authors
                .map((a) => `${a.fullName?.firstName || ''} ${a.fullName?.lastName || ''}`.trim())
                .join(', ')}
            </p>
          </div>
        )}
      </motion.main>

      {/* Scroll-to-top FAB */}
      <AnimatePresence>
        {scrollTop && (
          <motion.button
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            onClick={() => window.scroll({ top: 0, behavior: 'smooth' })}
            className="fixed z-30 bottom-6 right-6 w-10 h-10 rounded-full bg-[#1a1d24] border border-white/10 hover:border-red-500/50 flex items-center justify-center text-gray-400 hover:text-white transition shadow-lg"
            aria-label="Scroll to top"
          >
            <CgChevronUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};

export default ThesisPage;
