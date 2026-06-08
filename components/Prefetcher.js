import { createContext, useContext, useEffect, useRef, useState } from "react";

import { client, listenSanity, refetchType } from "../lib/sanity";
import { SITE_CONFIG_QUERY } from "../lib/siteConfig";
import { BLOG_LIST_QUERY } from "../lib/groq/blog";
import { BULLETIN_LIST_QUERY } from "../lib/groq/bulletin";
import { THESIS_LIST_QUERY } from "../lib/groq/thesis";
import { AWARDS_LIST_QUERY } from "../lib/groq/awards";
import { GALLERY_LIST_QUERY } from "../lib/groq/gallery";

const PrefetcherContext = createContext();

const PrefetcherWrapper = ({ children }) => {
  const [blogs, setBlogs] = useState([]);
  const [bulletins, setBulletins] = useState([]);
  const [thesis, setThesis] = useState([]);
  const [awards, setAwards] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [globalSearchItems, setGlobalSearchItems] = useState([]);
  const [siteConfig, setSiteConfig] = useState(null);

  const sharedStates = { blogs, bulletins, thesis, awards, gallery, globalSearchItems, siteConfig };

  const fetchInitialData = async () => {
    try {
      const [res_blog, res_bulletin, res_thesis, res_awards, res_gallery, res_config] = await Promise.all([
        client.fetch(BLOG_LIST_QUERY),
        client.fetch(BULLETIN_LIST_QUERY),
        client.fetch(THESIS_LIST_QUERY),
        client.fetch(AWARDS_LIST_QUERY),
        client.fetch(GALLERY_LIST_QUERY),
        client.fetch(SITE_CONFIG_QUERY),
      ]);
      setBlogs(res_blog || []);
      setBulletins(res_bulletin || []);
      setThesis(res_thesis || []);
      setAwards(res_awards || []);
      setGallery(res_gallery || []);
      setSiteConfig(res_config || {});
      setGlobalSearchItems([...(res_blog || []), ...(res_bulletin || []), ...(res_thesis || []), ...(res_awards || []), ...(res_gallery || [])]);
    } catch (err) {
      console.error("[Prefetcher] Initial fetch error:", err);
    }
  };

  useEffect(() => { fetchInitialData(); }, []);

  const setterMap = useRef({
    blog: (data) => { setBlogs(data); updateGlobal(data, "blog"); },
    bulletin: (data) => { setBulletins(data); updateGlobal(data, "bulletin"); },
    thesis: (data) => { setThesis(data); updateGlobal(data, "thesis"); },
    award: (data) => { setAwards(data); updateGlobal(data, "award"); },
    gallery: (data) => { setGallery(data); updateGlobal(data, "gallery"); },
  });

  function updateGlobal(data, type) {
    setGlobalSearchItems((prev) => {
      const filtered = prev.filter((item) => item._type !== type);
      return [...filtered, ...data];
    });
  }

  useEffect(() => {
    const sub = listenSanity((type) => {
      const setter = setterMap.current[type];
      if (setter) refetchType(type).then((data) => { if (data) setter(data); });
    });
    return () => sub.unsubscribe();
  }, []);

  return (
    <PrefetcherContext.Provider value={sharedStates}>
      {children}
    </PrefetcherContext.Provider>
  );
};

const usePrefetcher = () => useContext(PrefetcherContext);

export { PrefetcherWrapper, usePrefetcher };
