import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search } from "@geist-ui/icons";
import { usePrefetcher } from "./Prefetcher";
import Link from "next/link";

const TYPE_LABELS = {
  blog: "Blog",
  bulletin: "Bulletin",
  thesis: "Thesis",
  award: "Award",
  gallery: "Gallery",
};

const SearchModal = ({ isOpen, onClose }) => {
  const { globalSearchItems } = usePrefetcher();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const inputRef = useRef(null);

  // Filter items by title and tags
  const handleSearch = (value) => {
    setQuery(value);
    if (value.length < 2) {
      setResults([]);
      return;
    }
    const term = value.toLowerCase();
    setResults(
      (globalSearchItems || []).filter((item) => {
        const titleMatch = (item.title || "").toLowerCase().includes(term);
        const tagMatch = (item.tags || []).some((tag) =>
          (tag || "").toLowerCase().includes(term)
        );
        return titleMatch || tagMatch;
      })
    );
  };

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
          className="fixed inset-0 z-[200] flex justify-center items-start bg-black/20 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="w-full max-w-[560px] mt-[10vh] mx-4 rounded-md border border-[#2A2A2A] bg-[#181818] overflow-hidden"
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 py-4 border-b border-[#2A2A2A]">
              <Search size={20} className="text-[#8C8C8C] shrink-0" strokeWidth={2} color="#8C8C8C" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search blogs, thesis, awards..."
                aria-label="Search content"
                className="flex-1 bg-transparent border-none outline-none text-[0.9375rem] text-[#EFEFEF] placeholder:text-[#8C8C8C] font-normal"
              />
              <button
                onClick={onClose}
                className="shrink-0 px-2 py-0.5 bg-[#333333] text-[#8C8C8C] text-[0.8rem] font-sans font-medium uppercase tracking-wide transition-colors hover:bg-[#3d3d3d]"
              >
                ESC
              </button>
            </div>

            {/* Results */}
            <div className="max-h-[60vh] overflow-y-auto" data-lenis-prevent>
              {results.length > 0 && (
                <div className="">
                  {results.map((item, i) => (
                    <Link
                      key={item._id || i}
                      href={`/${item._type}/${item.slug}`}
                      scroll={false}
                      onClick={onClose}
                    >
                      <div className="flex flex-col gap-1.5 px-4 py-4 hover:bg-[#252525] cursor-pointer transition-colors">
                        <span className="text-[0.8rem] font-sans font-semibold uppercase tracking-wider text-[#FF5154]">
                          {TYPE_LABELS[item._type] || item._type}
                        </span>
                        <span className="text-[1.1rem] text-[#EFEFEF] font-medium leading-relaxed">
                          {item.title}
                        </span>
                        {item.tags?.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {item.tags.slice(0, 3).map((tag, j) => (
                              <span
                                key={j}
                                className="px-2 py-0.5 bg-[#333333] text-[#EFEFEF] text-[0.8rem] font-sans font-medium uppercase tracking-wide"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {results.length === 0 && query.length >= 2 && (
                <div className="px-4 py-8 text-center text-[#8C8C8C] text-[0.9375rem] font-normal">
                  No results for &quot;{query}&quot;
                </div>
              )}

              {query.length < 2 && (
                <div className="px-4 py-8 text-center text-[#8C8C8C] text-[0.9375rem] font-normal">
                  Start typing to search...
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchModal;
