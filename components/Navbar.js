/*
  TODO: [-] implement global search result to include a dynamic page content
  TODO: [x] implement global search autosuggestion

  ! Due to network traffic todo #1 cannot be implemented
*/

import {
  FaArrowRight,
  FaArrowDown,
  FaSearch,
  FaCross,
  FaXbox,
  FaWindowClose,
} from 'react-icons/fa';
import { AiOutlineMenu } from 'react-icons/ai';
import { CgChevronRight, CgClose, CgSearch } from 'react-icons/cg';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useViewportScroll } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { usePrefetcherContext } from './Prefetcher';

const SideMenu = ({ closeHandler, isOpen }) => {
  const { globalSearchItems } = usePrefetcherContext();
  const [mb_globalSearchOpen, mb_setGlobalSearchOpen] = useState(false);
  const [mb_globalSearchArray, mb_setGlobalSearchArray] = useState([]);
  const [mb_globalSearchResults, mb_setGlobalSearchResults] = useState([]);
  const [mb_globalSearchQuery, mb_setGlobalSearchQuery] = useState('');
  const [mb_globalSearchIsEmpty, mb_setGlobalSearchIsEmpty] = useState(false);
  const { scrollY } = useViewportScroll();

  useEffect((e) => {
    if (globalSearchItems) {
      // destructure globalSearchItems to get the _type, any fields with title on it, and the tags
      const newArray = globalSearchItems.map((item) => {
        return {
          _type: item._type.replace(/_/g, ''),
          title: item.blogTitle || item.bulletinTitle || item.capstoneTitle,
          tags: item.tags,
          slug: item.slug,
        };
      });
      mb_setGlobalSearchArray(newArray);
    }
  }, []);

  const toggleGlobalSearch = (e) => {
    mb_setGlobalSearchOpen(!mb_globalSearchOpen);
  };

  const globalSearchHandler = (val) => {
    mb_setGlobalSearchResults([]);
    let searchRes = mb_globalSearchArray.filter((item) => {
      // search in title and in tags
      return (
        item.title.toLowerCase().includes(val.toLowerCase()) ||
        item.tags.some((tag) => tag.toLowerCase().includes(val.toLowerCase()))
      );
    });

    mb_setGlobalSearchIsEmpty(searchRes.length < 1);
    mb_setGlobalSearchResults(searchRes);
  };

  return (
    <>
      <AnimatePresence exitBeforeEnter>
        {mb_globalSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="z-[88] fixed w-full h-full bg-base-100 flex justify-center select-none md:hidden"
          >
            <motion.div
              initial={{ translateY: -20 }}
              animate={{ translateY: 0 }}
              exit={{ translateY: 20 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="w-full max-w-3xl flex flex-col gap-10 pt-24 px-10 md:px-0"
            >
              <div className="w-full flex gap-5 items-end">
                <div className="w-full flex flex-col justify-end">
                  <input
                    onChange={(e) => {
                      if (e.currentTarget.value.length < 3) {
                        mb_setGlobalSearchResults([]);
                        mb_setGlobalSearchIsEmpty(false);
                      } else {
                        mb_setGlobalSearchQuery(e.target.value);
                        globalSearchHandler(e.currentTarget.value);
                      }
                    }}
                    className="input input-primary input-bordered w-full"
                    placeholder="Search for any page with 3 or more characters"
                  />
                </div>
                <div
                  onClick={toggleGlobalSearch}
                  className="btn btn-ghost btn-square"
                >
                  <CgClose size={15} />
                </div>
              </div>
              <div className="flex flex-col gap-5">
                {/* loop the globalSearchResuls and limit to 7 */}
                {mb_globalSearchResults.length > 0 &&
                  mb_globalSearchResults.slice(0, 5).map((item, index) => {
                    return (
                      <Link key={index} href={`/${item._type}/${item.slug}`}>
                        <motion.p
                          onClick={(e) => {
                            mb_setGlobalSearchResults([]);
                            mb_setGlobalSearchQuery('');
                            mb_setGlobalSearchOpen(false);
                            closeHandler();
                          }}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.2,
                            ease: 'easeOut',
                            delay: index * 0.05,
                          }}
                          className="px-5 py-3 cursor-pointer bg-base-200 rounded flex justify-between items-center"
                        >
                          <span>{item.title}</span>
                          <span>
                            <CgChevronRight />
                          </span>
                        </motion.p>
                      </Link>
                    );
                  })}
                {mb_globalSearchIsEmpty && (
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="text-center text-base-content"
                  >
                    No results found for &ldquo;{mb_globalSearchQuery}&rdquo;
                  </motion.p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.main
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
        }}
        exit={{
          opacity: 0,
        }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="fixed top-0 left-0 w-full h-full bg-base-100 items-center justify-center z-50 md:hidden"
      >
        <div
          className={`absolute w-full px-5 flex justify-between items-center transition-all ${
            scrollY.get() > 100 ? 'py-7' : 'py-12'
          }`}
        >
          <p className="text-2xl font-bold mb-2 text-transparent cursor-pointer">
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
          <motion.div
            layoutId="menuButton"
            className="btn btn-circle"
            onClick={closeHandler}
          >
            <CgClose />
          </motion.div>
        </div>

        <motion.div
          initial={{ translateY: -20 }}
          animate={{ translateY: 0 }}
          exit={{ translateY: 20 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="flex flex-col w-full h-full items-center justify-center px-5"
        >
          <Link href={'/'} scroll={false}>
            <p
              onClick={closeHandler}
              className="btn btn-ghost no-animation btn-xl w-full  text-base-content"
            >
              Home
            </p>
          </Link>
          <Link href={'/blog'} scroll={false}>
            <p
              onClick={closeHandler}
              className="btn btn-ghost no-animation btn-xl w-full mt-10  text-base-content"
            >
              Blog
            </p>
          </Link>
          <Link href={'/bulletin'} scroll={false}>
            <p
              onClick={closeHandler}
              className="btn btn-ghost no-animation btn-xl w-full  text-base-content"
            >
              Bulletin
            </p>
          </Link>
          <Link href={'/capstone'} scroll={false}>
            <p
              onClick={closeHandler}
              className="btn btn-ghost no-animation btn-xl w-full  text-base-content"
            >
              CAPSTONE
            </p>
          </Link>
          <Link href={'/about'} scroll={false}>
            <p
              onClick={closeHandler}
              className="btn btn-ghost no-animation btn-xl w-full  text-base-content mt-10"
            >
              about us
            </p>
          </Link>
          <div
            onClick={toggleGlobalSearch}
            className="btn btn-ghost no-animation btn-xl w-full  text-base-content mt-10"
          >
            Search Globally
          </div>
        </motion.div>
      </motion.main>
    </>
  );
};

const Navbar = (e) => {
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const router = useRouter();
  const [scrollYValue, setScrollYValue] = useState(0);
  const [route, setRoute] = useState(router.pathname);
  const [globalSearchOpen, setGlobalSearchOpen] = useState(false);
  const [globalSearchArray, setGlobalSearchArray] = useState([]);
  const [globalSearchResults, setGlobalSearchResults] = useState([]);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [globalSearchIsEmpty, setGlobalSearchIsEmpty] = useState(false);
  const { globalSearchItems } = usePrefetcherContext();

  useEffect((e) => {
    setRoute(router.pathname);

    if (globalSearchItems) {
      // destructure globalSearchItems to get the _type, any fields with title on it, and the tags
      const newArray = globalSearchItems.map((item) => {
        return {
          _type: item._type.replace(/_/g, ''),
          title: item.blogTitle || item.bulletinTitle || item.capstoneTitle,
          tags: item.tags,
          slug: item.slug,
        };
      });
      setGlobalSearchArray(newArray);
    }
  }, []);

  useEffect(
    (e) => {
      setRoute(router.pathname);
    },
    [router]
  );

  const handleScroll = (e) => {
    setScrollYValue(window.scrollY);
  };

  useEffect((e) => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleGlobalSearch = (e) => {
    setGlobalSearchOpen(!globalSearchOpen);
  };

  const globalSearchHandler = (val) => {
    setGlobalSearchResults([]);
    let searchres = globalSearchArray.filter((item) => {
      // search in title and in tags
      return (
        item.title.toLowerCase().includes(val.toLowerCase()) ||
        item.tags.some((tag) => tag.toLowerCase().includes(val.toLowerCase()))
      );
    });

    setGlobalSearchIsEmpty(searchres.length < 1);
    setGlobalSearchResults(searchres);
  };

  return (
    <>
      <AnimatePresence exitBeforeEnter>
        {sideMenuOpen && (
          <SideMenu
            closeHandler={(e) => setSideMenuOpen(false)}
            isOpen={sideMenuOpen}
          />
        )}
      </AnimatePresence>

      <AnimatePresence exitBeforeEnter>
        {globalSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="z-[88] fixed w-full h-full bg-base-100 flex justify-center select-none"
          >
            <motion.div
              initial={{ translateY: -20 }}
              animate={{ translateY: 0 }}
              exit={{ translateY: 20 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="w-full max-w-3xl flex flex-col gap-10 pt-24 px-10 md:px-0"
            >
              <div className="w-full flex gap-5 items-end">
                <div className="w-full flex flex-col justify-end">
                  <input
                    onChange={(e) => {
                      if (e.currentTarget.value.length < 3) {
                        setGlobalSearchResults([]);
                      } else {
                        setGlobalSearchQuery(e.target.value);
                        setGlobalSearchIsEmpty(false);
                        globalSearchHandler(e.target.value);
                      }
                    }}
                    className="input input-primary input-bordered w-full"
                    placeholder="Search for any page with 3 or more characters"
                  />
                </div>
                <div
                  onClick={toggleGlobalSearch}
                  className="btn btn-ghost btn-square"
                >
                  <CgClose size={15} />
                </div>
              </div>
              <div className="flex flex-col gap-5">
                {globalSearchResults.length > 0 &&
                  globalSearchResults.slice(0, 5).map((item, index) => {
                    return (
                      <Link key={index} href={`/${item._type}/${item.slug}`}>
                        <motion.p
                          onClick={(e) => {
                            setGlobalSearchResults([]);
                            setGlobalSearchQuery('');
                            setGlobalSearchOpen(false);
                          }}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.2,
                            ease: 'easeOut',
                            delay: index * 0.05,
                          }}
                          className="px-5 py-3 cursor-pointer bg-base-200 rounded flex justify-between items-center"
                        >
                          <span>{item.title}</span>
                          <span>
                            <CgChevronRight />
                          </span>
                        </motion.p>
                      </Link>
                    );
                  })}
                {globalSearchIsEmpty && (
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="text-center text-base-content"
                  >
                    No results found for &ldquo;{globalSearchQuery}&rdquo;
                  </motion.p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className={`flex justify-center fixed w-full z-40 select-none transition-all ${
          scrollYValue < 100 ? 'bg-transparent py-10' : 'bg-base-100 py-5'
        }`}
      >
        <nav className="navbar w-full items-center max-w-6xl px-5 md:px-10 xl:px-0">
          <div className="navbar-start">
            <Link href={'/'} scroll={false}>
              <p className="text-2xl font-bold mb-2 text-transparent cursor-pointer">
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
          {/* desktop links */}
          <div className="navbar-end gap-3 hidden md:flex">
            <Link href={'/blog'} scroll={false}>
              <p
                className={`btn btn-sm   ${
                  route.includes('/blog')
                    ? 'btn-link underline underline-offset-4'
                    : 'btn-ghost'
                }`}
              >
                Blog
              </p>
            </Link>
            <Link href={'/bulletin'} scroll={false}>
              <p
                className={`btn btn-sm   ${
                  route.includes('/bulletin')
                    ? 'btn-link underline underline-offset-4'
                    : 'btn-ghost'
                }`}
              >
                Bulletin
              </p>
            </Link>
            <Link href={'/capstone'} scroll={false}>
              <p
                className={`btn btn-sm  ${
                  route.includes('/capstone')
                    ? 'btn-link underline underline-offset-4'
                    : 'btn-ghost'
                }`}
              >
                CAPSTONE
              </p>
            </Link>
            <Link href={'/about'} scroll={false}>
              <p
                className={`btn btn-sm  ${
                  route.includes('/about')
                    ? 'btn-link underline underline-offset-4'
                    : 'btn-ghost'
                }`}
              >
                About
              </p>
            </Link>
            <div onClick={toggleGlobalSearch} className="btn btn-square btn-sm">
              <FaSearch />
            </div>
          </div>
          {/* mobile dropdown */}
          <div className="navbar-end gap-10 md:hidden">
            <motion.div
              onClick={(e) => setSideMenuOpen(true)}
              className="btn btn-square rounded-full"
            >
              <AiOutlineMenu />
            </motion.div>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Navbar;
