import { AnimatePresence, motion } from 'framer-motion';
import { Button, IconButton, Input, Tooltip } from '@material-tailwind/react';
import { CgClose, CgMenu, CgSearch } from 'react-icons/cg';
import { useEffect, useRef, useState } from 'react';

import Link from 'next/link';
import { usePrefetcer } from './Prefetcher';

const Navbar = (e) => {
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [globalSearchMenuOpen, setGlobalSearchMenuOpen] = useState(false);
  const [thresholdReached, setThresholdReached] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const { globalSearchItems } = usePrefetcer();

  const searchItems = (e) => {
    const thisSearchValue = e.target.value;
    console.log(globalSearchItems);

    if (thisSearchValue.length > 3) {
      const results = globalSearchItems.filter((item) => {
        if (
          item.title.toLowerCase().includes(thisSearchValue.toLowerCase()) ||
          item.tags.some((tag) =>
            tag.toLowerCase().includes(thisSearchValue.toLowerCase())
          )
        ) {
          // return 5 items
          return item;
        }
      });
      setSearchResults(results.slice(0, 4));
    } else {
      setSearchResults([]);
    }
  };

  useEffect((e) => {
    window.addEventListener('scroll', (e) => {
      setThresholdReached(window.scrollY > 75);
    });
  }, []);

  // check if user pressed ctrl + k and if so, set global search menu open to true
  useEffect((e) => {
    window.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === 'k') {
        setGlobalSearchMenuOpen(true);
      }
      // if user pressed esc, set global search menu open to false
      if (e.key === 'Escape') {
        setGlobalSearchMenuOpen(false);
        setSearchValue('');
        setSearchResults([]);
      }
    });
  }, []);

  return (
    <>
      {/* side nav */}
      <AnimatePresence exitBeforeEnter>
        {sideMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'circOut' }}
            className="lg:hidden fixed z-[90] w-full bg-[#0A0C10] bg-opacity-60"
          >
            <motion.div
              initial={{ x: -50 }}
              animate={{ x: 0 }}
              exit={{ x: -50 }}
              transition={{ duration: 0.3, ease: 'circOut' }}
              className="w-10/12 sm:w-6/12 min-h-screen bg-grey-900 flex flex-col justify-center gap-2 px-4"
            >
              <Link href="/blog">
                <Button
                  onClick={(e) => setSideMenuOpen(false)}
                  variant="text"
                  color="yellow"
                >
                  blog
                </Button>
              </Link>
              <Link href="/bulletin">
                <Button
                  onClick={(e) => setSideMenuOpen(false)}
                  variant="text"
                  color="yellow"
                >
                  bulletin
                </Button>
              </Link>
              <Link href="/thesis">
                <Button
                  onClick={(e) => setSideMenuOpen(false)}
                  variant="text"
                  color="yellow"
                >
                  thesis
                </Button>
              </Link>
              <Button
                onClick={(e) => setSideMenuOpen(false)}
                variant="text"
                color="yellow"
              >
                about
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* global search */}
      <AnimatePresence exitBeforeEnter>
        {globalSearchMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'circOut' }}
            className="fixed z-[90] w-full h-screen bg-[#0A0C10] bg-opacity-[0.98] flex justify-center"
          >
            <motion.div
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              transition={{ duration: 0.3, ease: 'circOut' }}
              onClick={(e) =>
                e.currentTarget === e.target && setGlobalSearchMenuOpen(false)
              }
              className="w-full max-w-4xl pt-32 min-h-full  flex flex-col gap-2 px-4"
            >
              <p className="hidden lg:block">Press ESC to quit searching</p>
              <Input
                autoFocus
                variant="outlined"
                size="lg"
                label="Search from ingo"
                style={{ color: 'white' }}
                className="text-lg"
                onChange={(e) => {
                  setSearchValue(e.currentTarget.value);
                  if (e.currentTarget.value.length >= 3) {
                    searchItems(e);
                  } else {
                    setSearchResults([]);
                  }
                }}
                value={searchValue}
              />

              {/* results */}
              <div className="flex flex-col gap-3 mt-5">
                {/* only return whats on the search value */}
                {searchResults.map((item, i) => (
                  <Link
                    key={i}
                    href={`/${item._type}/${item.slug}`}
                    scroll={false}
                  >
                    <motion.div
                      onClick={() => setGlobalSearchMenuOpen(false)}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, ease: 'circOut' }}
                      className="bg-grey-900 p-4 rounded-lg hover:bg-grey-800 cursor-pointer flex flex-col"
                    >
                      <p className="text-sm text-yellow-500">
                        {item._type.charAt(0).toUpperCase() +
                          item._type.slice(1)}
                      </p>
                      <p>{item.title}</p>
                    </motion.div>
                  </Link>
                ))}

                {/* if no results, show this */}
                {searchResults.length === 0 && searchValue.length >= 4 && (
                  <p className="text-sm text-yellow-500">
                    No results for &quot;{searchValue}&quot;
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main
        className={`
          ${thresholdReached ? 'py-5 bg-[#0A0C10]' : 'py-10 bg-transparent'}
          fixed w-full  flex justify-center items-center px-5 lg:px-0 z-[99] transition-all duration-200
        `}
      >
        <div className="w-full max-w-4xl flex justify-between">
          <div className="flex gap-5 items-center">
            <div className="flex gap-2 lg:hidden">
              <IconButton
                onClick={() => setSideMenuOpen(!sideMenuOpen)}
                color="yellow"
                variant="text"
              >
                {sideMenuOpen ? <CgClose size={20} /> : <CgMenu size={20} />}
              </IconButton>
            </div>
            <Link href="/">
              <p className="text-2xl font-bold text-transparent cursor-pointer">
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
            </Link>
          </div>
          <div className="lg:flex gap-2 hidden">
            <Link href="/blog" scroll={false}>
              <Button color="yellow" variant="text">
                blog
              </Button>
            </Link>
            <Link href="/bulletin" scroll={false}>
              <Button color="yellow" variant="text">
                bulletin
              </Button>
            </Link>
            <Link href="/thesis" scroll={false}>
              <Button color="yellow" variant="text">
                thesis
              </Button>
            </Link>
            <Link href="/about" scroll={false}>
              <Button color="yellow" variant="text" scroll={false}>
                about
              </Button>
            </Link>
            <Tooltip
              content="You can press CTRL + K to open search"
              placement="bottom-end"
            >
              <IconButton
                onClick={() => {
                  setGlobalSearchMenuOpen(!globalSearchMenuOpen);
                  setSearchValue('');
                  setSearchResults([]);
                }}
                color="yellow"
                variant="text"
              >
                {globalSearchMenuOpen ? (
                  <CgClose size={20} />
                ) : (
                  <CgSearch size={20} />
                )}
              </IconButton>
            </Tooltip>
          </div>
          <div className="flex lg:hidden">
            <IconButton
              onClick={() => {
                setGlobalSearchMenuOpen(!globalSearchMenuOpen);
                setSearchValue('');
                setSearchResults([]);
              }}
              color="yellow"
              variant="text"
            >
              {globalSearchMenuOpen ? (
                <CgClose size={20} />
              ) : (
                <CgSearch size={20} />
              )}
            </IconButton>
          </div>
        </div>
      </main>
    </>
  );
};

export default Navbar;
