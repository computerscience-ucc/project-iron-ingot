import { AnimatePresence, motion } from "framer-motion";
import { createContext, useContext, useEffect, useRef, useState } from "react";

import { client, listenSanity, refetchType } from "../lib/sanity";
import { SITE_CONFIG_QUERY } from "../lib/siteConfig";

// queries
const query_blog = `
  *[_type == 'blog'] | order(_createdAt desc, _updatedAt desc)  {
    _id,
    _createdAt,
    _updatedAt,
    _type,
    "headerImage": headerImage.asset -> url,
    "title": blogTitle,
    "slug": slug.current,
    "authors": blogAuthor[] -> { fullName, pronouns, "authorPhoto": authorPhoto.asset -> url },
    academicYear,
    tags
  }
`;
const query_bulletin = `
  *[_type == 'bulletin'] | order(_createdAt desc, _updatedAt desc) {
    _id,
    _createdAt,
    _updatedAt,
    _type,
    "headerImage": headerImage.asset -> url,
    "title": bulletinTitle,
    "slug": slug.current,
    "authors": bulletinAuthor[] -> { fullName, pronouns, "authorPhoto": authorPhoto.asset -> url },
    tags
  }
`;
const query_thesis = `
  *[_type == 'thesis'] | order(academicYear desc, _createdAt desc){
    _id,
    _createdAt,
    _updatedAt,
    _type,
    "headerImage": headerImage.asset -> url,
    "title": thesisTitle,
    "slug": slug.current,
    "authors": postAuthor[] -> { fullName, pronouns, "authorPhoto": authorPhoto.asset -> url },
    "description": pt::text(thesisContent),
    academicYear,
    department,
    tags,
  }
`;
const query_award = `
  *[_type == 'award'] | order(academicYear desc, dateAwarded desc){
    _id,
    _createdAt,
    _updatedAt,
    _type,
    "headerImage": headerImage.asset -> url,
    "title": awardTitle,
    "slug": slug.current,
    "category": awardCategory,
    "badges": awardBadges,
    "recipients": recipients[] -> { "fullName": fullName.firstName ++ " " ++ fullName.lastName, pronouns, batchYear, yearLevel, program, "recipientPhoto": recipientPhoto.asset -> url },
    "images": awardImages[].asset->url,
    "description": awardDescription,
    academicYear,
    dateAwarded,
    tags,
  }
`;
const query_gallery = `
  *[_type == 'gallery'] | order(projectDate desc, _createdAt desc) {
    _id,
    _createdAt,
    _updatedAt,
    _type,
    "title": projectTitle,
    "slug": slug.current,
    personName,
    "profilePicture": profilePicture.asset -> url,
    projectDate,
    youtubeEmbedLink,
    githubUrl,
    linkedinProfile,
    tags,
  }
`;

const PrefetcherContext = createContext();

const PrefetcherWrapper = ({ children }) => {
  const [blogs, setBlogs] = useState([]);
  const [bulletins, setBulletins] = useState([]);
  const [thesis, setThesis] = useState([]);
  const [awards, setAwards] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [globalSearchItems, setGlobalSearchItems] = useState([]);
  const [siteConfig, setSiteConfig] = useState(null);
  const [loaded, setLoaded] = useState(false);

  let sharedStates = {
    blogs,
    bulletins,
    thesis,
    awards,
    gallery,
    globalSearchItems,
    siteConfig,
  };

  const fetchInitialData = async () => {
    const res_blog = await client.fetch(query_blog);
    const res_bulletin = await client.fetch(query_bulletin);
    const res_thesis = await client.fetch(query_thesis);
    const res_awards = await client.fetch(query_award);
    const res_gallery = await client.fetch(query_gallery);
    const res_config = await client.fetch(SITE_CONFIG_QUERY);
    const globalItems = [...res_blog, ...res_bulletin, ...res_thesis, ...res_awards, ...res_gallery];

    setBlogs(res_blog);
    setBulletins(res_bulletin);
    setThesis(res_thesis);
    setAwards(res_awards);
    setGallery(res_gallery);
    setGlobalSearchItems(globalItems);
    setSiteConfig(res_config || {});

    if (res_blog && res_thesis && res_bulletin && res_awards && res_gallery) {
      setTimeout(() => {
        setLoaded(true);
      }, 200);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

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
      if (setter) {
        refetchType(type).then((data) => {
          if (data) setter(data);
        });
      }
    });
    return () => sub.unsubscribe();
  }, []);

  return (
    <PrefetcherContext.Provider value={sharedStates}>
      <AnimatePresence>
        {loaded && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {children}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!loaded && (
          <motion.main
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-2"
            style={{ backgroundColor: "#181818" }}
          >
            {/* Brand label */}
            <div className="overflow-hidden">
              <motion.span
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{
                  duration: 0.95,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="block font-sans font-semibold text-[1.1rem] tracking-wide text-[#EFEFEF] select-none"
              >
                uccingo
              </motion.span>
            </div>

            {/* Loading bar track */}
            <div className="relative w-[180px] h-[3px] rounded-full overflow-hidden bg-[#2A2A2A]">
              {/* Fill bar */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background: "linear-gradient(90deg, #FF3538, #FF6B6B, #FF3538)",
                  boxShadow: "0 0 12px rgba(255, 53, 56, 0.4)",
                }}
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{
                  duration: 1.4,
                  ease: [0.45, 0, 0.55, 1],
                  repeat: Infinity,
                }}
              />
            </div>
          </motion.main>
        )}
      </AnimatePresence>
    </PrefetcherContext.Provider>
  );
};

const usePrefetcher = () => {
  return useContext(PrefetcherContext);
};

export { PrefetcherWrapper, usePrefetcher };
