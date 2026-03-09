import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { CgArrowRight } from 'react-icons/cg';
import PersonCard from './PersonCard';

const CAROUSEL_THRESHOLD = 5;
const AUTO_SCROLL_THRESHOLD = CAROUSEL_THRESHOLD;
const SCROLL_SPEED = 0.4;

const MemberCarousel = ({ members, renderItem, onPersonClick }) => {
  const containerRef = useRef();
  const innerRef = useRef();
  const x = useMotionValue(0);
  const [constraint, setConstraint] = useState(0);
  const isDragging = useRef(false);
  const isHovering = useRef(false);
  const isVisible = useRef(false);
  const autoScroll = members.length >= AUTO_SCROLL_THRESHOLD;

  useEffect(() => {
    const measure = () => {
      if (innerRef.current && containerRef.current) {
        setConstraint(innerRef.current.scrollWidth - containerRef.current.offsetWidth);
      }
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [members]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { isVisible.current = entry.isIntersecting; },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!autoScroll || constraint <= 0) return;
    let dir = -1;
    let raf;
    const step = () => {
      if (!isDragging.current && !isHovering.current && isVisible.current) {
        const cur = x.get();
        let next = cur + dir * SCROLL_SPEED;
        if (next <= -constraint) { dir = 1; }
        if (next >= 0) { dir = -1; }
        x.set(next);
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [autoScroll, constraint, x]);

  const defaultRender = (m, i) => (
    <PersonCard
      key={i}
      name={m.name}
      subtitle={m.role || 'Member'}
      photo={m.photo}
      onClick={onPersonClick ? () => onPersonClick({ name: m.name, photo: m.photo, subtitle: m.role || 'Member' }) : undefined}
    />
  );

  return (
    <div
      className="w-full"
      onMouseEnter={() => { isHovering.current = true; }}
      onMouseLeave={() => { isHovering.current = false; }}
    >
      <motion.div ref={containerRef} className="cursor-grab overflow-hidden">
        <motion.div
          ref={innerRef}
          style={{ x }}
          drag="x"
          dragConstraints={{ right: 0, left: -constraint }}
          onDragStart={() => { isDragging.current = true; }}
          onDragEnd={() => { setTimeout(() => { isDragging.current = false; }, 300); }}
          whileTap={{ cursor: 'grabbing' }}
          className="flex gap-5 py-2 w-max"
        >
          {members.map(renderItem || defaultRender)}
        </motion.div>
      </motion.div>
      <p className="flex items-center justify-end gap-2 mt-3 text-xs text-white/30">
        {autoScroll && <span className="animate-pulse text-white/20">Auto-scrolling</span>}
        <span>Drag to browse</span>
        <CgArrowRight size={14} className="text-yellow-500/60" />
      </p>
    </div>
  );
};

export default MemberCarousel;
