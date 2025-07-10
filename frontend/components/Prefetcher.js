import { AnimatePresence, motion } from 'framer-motion';
import { createContext, useContext, useEffect, useState } from 'react';

import sanityClient from '@sanity/client';

export const client = sanityClient({
  projectId: 'gjvp776o',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2022-06-22',
});

// queries
const query_blog = `
  *[_type == 'blog'] | order(_createdAt desc, _updatedAt desc)  {
    _id,
    _createdAt,
    _updatedAt,
    _type,
    "title": blogTitle,
    "slug": slug.current,
    "authors": blogAuthor[] -> { fullName, pronouns, "authorPhoto": authorPhoto.asset -> url },
    tags
  }
`;
const query_bulletin = `
  *[_type == 'bulletin'] | order(_createdAt desc, _updatedAt desc) {
    _id,
    _createdAt,
    _updatedAt,
    _type,
    "title": bulletinTitle,
    "slug": slug.current,
    "authors": bulletinAuthor[] -> { fullName, pronouns, "authorPhoto": authorPhoto.asset -> url },
    tags
  }
`;
const query_thesis = `
  *[_type == 'thesis'] | order(_createdAt desc, _updatedAt desc){
    _id,
    _createdAt,
    _updatedAt,
    _type,
    "headerImage": headerImage.asset -> url,
    "title": thesisTitle,
    "slug": slug.current,
    "authors": postAuthor[] -> { fullName, pronouns, "authorPhoto": authorPhoto.asset -> url },
    tags,
  }
`;

const PrefetcherContext = createContext();

const PrefetcherWrapper = ({ children }) => {
  const [blogs, setBlogs] = useState([]);
  const [bulletins, setBulletins] = useState([]);
  const [thesis, setThesis] = useState([]);
  const [globalSearchItems, setGlobalSearchItems] = useState([]);
  const [loaded, setLoaded] = useState(false);

  let sharedStates = {
    blogs,
    bulletins,
    thesis,
    globalSearchItems,
  };

  const fetchInitalData = async () => {
    const res_blog = await client.fetch(query_blog);
    const res_bulletin = await client.fetch(query_bulletin);
    const res_thesis = await client.fetch(query_thesis);

    const globalItems = [...res_blog, ...res_bulletin, ...res_thesis];

    setBlogs(res_blog);
    setBulletins(res_bulletin);
    setThesis(res_thesis);
    setGlobalSearchItems(globalItems);

    if (res_blog && res_thesis && res_bulletin) {
      setTimeout(() => {
        setLoaded(true);
      }, 200);
    }
  };

  useEffect((e) => {
    fetchInitalData();
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
            className="fixed top-0 left-0 w-screen h-screen z-[9999] bg-[#0A0C10] flex justify-center items-center "
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

const usePrefetcer = () => {
  return useContext(PrefetcherContext);
};

export { PrefetcherWrapper, usePrefetcer };
