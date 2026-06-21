import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ModelViewer from "./ModelViewer";
import ShowcaseGallery from "./ShowcaseGallery";

const RightPanel = ({ model3d, showcase }) => {
  const hasModel   = !!model3d;
  const hasImages  = showcase && showcase.length > 0;
  const hasBoth    = hasModel && hasImages;
  const [tab, setTab] = useState(hasModel ? "model" : "images");

  if (!hasModel && !hasImages) return null;

  return (
    <div className="flex flex-col">
      {/* tab bar */}
      {hasBoth && (
        <div className="flex items-center bg-[#202020] rounded-[6px] p-1 gap-1 h-fit w-fit relative mb-2">
          {[{ id: "model", label: "3D Model" }, { id: "images", label: "Showcase" }].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`relative px-5 py-1.5 rounded-[4px] text-[0.875rem] transition-colors ${
                tab === t.id ? "text-white" : "text-[#8C8C8C] hover:text-[#EFEFEF]"
              }`}
            >
              {tab === t.id && (
                <motion.div
                  layoutId="activeRightTab"
                  className="absolute inset-0 bg-[#333333] rounded-[4px] z-0"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10 font-medium whitespace-nowrap">{t.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* content */}
      <AnimatePresence mode="wait">
        {(!hasBoth || tab === "model") && hasModel && (
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
        {(!hasBoth || tab === "images") && hasImages && (
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
