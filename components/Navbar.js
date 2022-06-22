import { FaArrowRight, FaArrowDown } from 'react-icons/fa';
import { CgClose } from 'react-icons/cg';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useViewportScroll } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/router';

const SideMenu = ({ closeHandler, isOpen }) => {
  return (
    <>
      <motion.main
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
        }}
        exit={{
          opacity: 0,
        }}
        className="fixed top-0 left-0 w-full h-full bg-base-100 items-center justify-center z-50 md:hidden"
      >
        <motion.div
          layoutId="menuButton"
          className="btn btn-circle absolute right-5 top-10"
          onClick={closeHandler}
        >
          <CgClose />
        </motion.div>
        <motion.div className="flex flex-col w-full h-full items-center justify-center px-5">
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

  useEffect((e) => {
    setRoute(router.pathname);
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

      <div
        className={`flex justify-center fixed w-full z-40 select-none transition-all ${
          scrollYValue < 100 ? 'bg-transparent py-10' : 'bg-base-100 py-5'
        }`}
      >
        <nav className="navbar w-full max-w-2xl items-center px-5 md:px-0">
          <div className="navbar-start">
            <Link href={'/'} scroll={false}>
              <p className="text-2xl">Ingo</p>
            </Link>
          </div>
          {/* desktop links */}
          <div className="navbar-end gap-3 hidden md:flex">
            <Link href={'/blog'} scroll={false}>
              <p
                className={`btn  text-base-content ${
                  route == '/blog' ? 'btn-secondary' : 'btn-link'
                }`}
              >
                Blog
              </p>
            </Link>
            <Link href={'/bulletin'} scroll={false}>
              <p
                className={`btn  text-base-content ${
                  route == '/bulletin' ? 'btn-secondary' : 'btn-link'
                }`}
              >
                Bulletin
              </p>
            </Link>
            <Link href={'/capstone'} scroll={false}>
              <p
                className={`btn text-base-content ${
                  route == '/capstone' ? 'btn-secondary' : 'btn-link'
                }`}
              >
                CAPSTONE
              </p>
            </Link>
            <Link href={'/about'} scroll={false}>
              <p
                className={`btn text-base-content ${
                  route == '/about' ? 'btn-secondary' : 'btn-link'
                }`}
              >
                About
              </p>
            </Link>
          </div>
          {/* mobile dropdown */}
          <div className="navbar-end gap-10 md:hidden">
            <motion.div
              onClick={(e) => setSideMenuOpen(true)}
              className="btn btn-square rounded-full"
            >
              <FaArrowDown />
            </motion.div>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Navbar;
