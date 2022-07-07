import { useContext, createContext, useEffect, useState } from 'react';
import sanityClient from '@sanity/client';
import { motion, AnimatePresence } from 'framer-motion';

export const client = new sanityClient({
  projectId: 'gjvp776o',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2022-06-22',
});

const blogQuery = `
  *[_type == "blog"] | order(_createdAt desc) {
    _id,
    _createdAt,
    _updatedAt,
    _type,
    blogTitle,
    "slug": slug.current,
    "blogAuthor": blogAuthor[] -> {fullName, pronouns, "authorPhoto": authorPhoto.asset -> url },
    tags
  }
`;

const bulletinQuery = `
  *[_type == "bulletin"] | order(_createdAt desc) {
    _id,
    _createdAt,
    _updatedAt,
    _type,
    bulletinTitle,
    "slug": slug.current,
    "bulletinAuthor": bulletinAuthor[] -> {fullName, pronouns, "authorPhoto": authorPhoto.asset -> url },
    tags
  }
`;

const capstoneQuery = `
  *[_type == 'capstone'] {
    _createdAt,
    _id,
    _updatedAt,
    _type,
    capstoneContent,
    capstoneTitle,
    "headerImage": headerImage.asset -> url,
    ownersInformation,
    "postAuthor": postAuthor[] -> {
      "authorPhoto": authorPhoto.asset -> url,
      fullName,
      pronouns
    },
    "slug": slug.current,
    tags
  }
`;

const PrefetcherContext = createContext();

const PrefetcherWrapper = ({ children }) => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [bulletinPosts, setBulletinPosts] = useState([]);
  const [capstonePosts, setCapstonePosts] = useState([]);
  const [globalSearchItems, setGlobalSearchItems] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const fetchAllInitialData = async (e) => {
    const req_blogPosts = await client.fetch(blogQuery);
    const req_bulletinPosts = await client.fetch(bulletinQuery);
    const req_capstonePosts = await client.fetch(capstoneQuery);
    setBlogPosts(req_blogPosts);
    setBulletinPosts(req_bulletinPosts);
    setCapstonePosts(req_capstonePosts);
    setGlobalSearchItems(
      req_blogPosts.concat(req_bulletinPosts).concat(req_capstonePosts)
    );

    if (req_blogPosts && req_bulletinPosts && req_capstonePosts) {
      setTimeout(() => {
        setLoaded(true);
      }, 200);
    }
  };

  useEffect((e) => {
    fetchAllInitialData();
  }, []);

  let sharedState = {
    blogPosts,
    bulletinPosts,
    capstonePosts,
    globalSearchItems,
  };

  return (
    <PrefetcherContext.Provider value={sharedState}>
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
            className="fixed top-0 left-0 w-screen h-screen z-[9999] bg-base-100 flex justify-center items-center "
          >
            <p className="text-4xl relative font-extrabold text-transparent select-none">
              <motion.span
                animate={{
                  backgroundPosition: [
                    '0% 0%',
                    '100% 0%',
                    '100% 100%',
                    '0% 100%',
                    '0% 0%',
                  ],
                }}
                transition={{
                  duration: 10,
                  ease: 'linear',
                  loop: Infinity,
                }}
                style={{
                  backgroundSize: '1000px 1000px',

                  backgroundColor: 'rgb(6, 182, 212)',
                  backgroundImage:
                    'radial-gradient(at 0% 100%, rgb(244, 63, 94) 0, transparent 50%), radial-gradient(at 90% 0%, rgb(16, 185, 129) 0, transparent 50%), radial-gradient(at 100% 100%, rgb(217, 70, 239) 0, transparent 50%), radial-gradient(at 0% 0%, rgb(249, 115, 22) 0, transparent 58%)',
                }}
                className="bg-clip-text bg-transparent"
              >
                ingo
              </motion.span>
            </p>
          </motion.main>
        )}
      </AnimatePresence>
    </PrefetcherContext.Provider>
  );
};

const usePrefetcherContext = (e) => {
  return useContext(PrefetcherContext);
};

export { PrefetcherWrapper, usePrefetcherContext };
