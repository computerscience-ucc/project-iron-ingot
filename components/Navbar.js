import { AnimatePresence, motion } from 'framer-motion';
import { Button, IconButton, Input, Tooltip } from '@material-tailwind/react';
import { CgClose, CgMenu, CgSearch } from 'react-icons/cg';
import { useEffect, useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/router';
import { usePrefetcher } from './Prefetcher';
import IngoLogo from './IngoLogo';

const NAV_LINKS = [
  { href: '/blog', label: 'blog' },
  { href: '/bulletin', label: 'bulletin' },
  { href: '/thesis', label: 'thesis' },
  { href: '/awards', label: 'awards' },
  { href: '/gallery', label: 'gallery' },
  { href: '/about', label: 'about' },
];

const Navbar = () => {
  const router = useRouter();
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [globalSearchMenuOpen, setGlobalSearchMenuOpen] = useState(false);
  const [thresholdReached, setThresholdReached] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const { globalSearchItems } = usePrefetcher();

  const isActivePath = (path) => {
    if (path === '/') return router.pathname === '/';
    return router.pathname === path || router.pathname.startsWith(`${path}/`);
  };

  const searchItems = (e) => {
    const thisSearchValue = e.target.value.toLowerCase();

    const results = (globalSearchItems || []).filter((item) => {
      const titleMatch = (item.title || '').toLowerCase().includes(thisSearchValue);
      const tagMatch = (item.tags || []).some((tag) =>
        (tag || '').toLowerCase().includes(thisSearchValue)
      );
      return titleMatch || tagMatch;
    });
    setSearchResults(results);
  };

  useEffect(() => {
    const handleScroll = () => setThresholdReached(window.scrollY > 75);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeydown = (e) => {
      if (e.ctrlKey && e.key === 'k') {
        setGlobalSearchMenuOpen(true);
      }
      if (e.key === 'Escape') {
        setGlobalSearchMenuOpen(false);
        setSearchValue('');
        setSearchResults([]);
      }
    };
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, []);

  return (
    <>
      {/* side nav */}
      <AnimatePresence mode="wait">
        {sideMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: {
                duration: 0.3,
                ease: 'circOut',
              },
            }}
            exit={{
              opacity: 0,
              transition: {
                duration: 0.3,
                ease: 'circIn',
              },
            }}
            className="lg:hidden fixed z-[90] w-full bg-[#0A0C10] bg-opacity-60"
          >
            <motion.div
              initial={{ x: -50 }}
              animate={{
                x: 0,
                transition: {
                  duration: 0.3,
                  ease: 'circOut',
                },
              }}
              drag="x"
              dragConstraints={{ left: -100, right: 0 }}
              dragElastic={{
                right: 0,
              }}
              onDrag={(e, info) => {
                if (info.point.x !== 0) {
                  setSideMenuOpen(false);
                }
              }}
              className="w-10/12 sm:w-6/12 min-h-screen bg-[#161a22] flex flex-col justify-center gap-2 px-4"
            >
              {NAV_LINKS.map(({ href, label }) => (
                <Link key={href} href={href}>
                  <Button
                    onClick={() => setSideMenuOpen(false)}
                    variant="text"
                    className={isActivePath(href) ? 'text-header-color' : 'text-button-color'}
                  >
                    {label}
                  </Button>
                </Link>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* global search */}
      <AnimatePresence mode="wait">
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
                  if (e.currentTarget.value.length >= 2) {
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
        className={`"gradient-background"
          ${thresholdReached ? 'py-5 bg-[#0A0C10]' : 'py-10 bg-transparent'}
          fixed w-full  flex justify-center items-center px-5 lg:px-0 z-[99] transition-all duration-200
        `}
      >
        <div className="w-full max-w-4xl flex justify-between">
          <div className="flex gap-5 items-center">
            <div className="flex gap-2 lg:hidden">
              <IconButton
                onClick={() => setSideMenuOpen(!sideMenuOpen)}
                className = "text-button-color"
                variant="text"
              >
                {sideMenuOpen ? <CgClose size={20} /> : <CgMenu size={20} />}
              </IconButton>
            </div>
            <Link href="/">
              <div className="cursor-pointer">
                <IngoLogo />
              </div>
            </Link>
          </div>
          <div className="lg:flex gap-2 hidden">
            {NAV_LINKS.map(({ href, label }) => (
              <Link key={href} href={href} scroll={false}>
                <Button className={`font-black ${isActivePath(href) ? 'text-header-color' : 'text-nav-color'}`} variant="text">
                  {label}
                </Button>
              </Link>
            ))}
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
                className = "text-nav-color"
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
              className = "text-button-color"
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
