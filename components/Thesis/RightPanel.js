import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ModelViewer from './ModelViewer';
import ShowcaseGallery from './ShowcaseGallery';

const RightPanel = ({ model3d, showcase }) => {
  const hasModel   = !!model3d;
  const hasImages  = showcase && showcase.length > 0;
  const hasBoth    = hasModel && hasImages;
  const [tab, setTab] = useState(hasModel ? 'model' : 'images');

  if (!hasModel && !hasImages) return null;

  return (
    <div className="sticky top-24 flex flex-col gap-2">
      {/* tab bar */}
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

      {/* content */}
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

export default RightPanel;
