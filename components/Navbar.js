import { FaArrowRight, FaArrowDown } from 'react-icons/fa';
import { CgClose } from 'react-icons/cg';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';

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
        className="fixed top-0 left-0 w-full h-full bg-base-200 items-center justify-center z-50 md:hidden"
      >
        <motion.div
          className="btn btn-circle absolute right-5 top-10"
          onClick={closeHandler}
        >
          <CgClose />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, translateY: -20 }}
          animate={{
            opacity: 1,
            translateY: 0,
            transition: { duration: 0.15, ease: 'circOut' },
          }}
          exit={{
            opacity: 0,
            translateY: 20,
            transition: { duration: 0.15, ease: 'circIn' },
          }}
          className="flex flex-col w-full h-full items-center justify-center px-5"
        >
          <Link href={'/'}>
            <p
              onClick={closeHandler}
              className="btn btn-ghost no-animation btn-xl w-full  text-base-content"
            >
              Home
            </p>
          </Link>
          <Link href={'/blog'}>
            <p
              onClick={closeHandler}
              className="btn btn-ghost no-animation btn-xl w-full mt-10  text-base-content"
            >
              Blog
            </p>
          </Link>
          <Link href={'/bulletin'}>
            <p
              onClick={closeHandler}
              className="btn btn-ghost no-animation btn-xl w-full  text-base-content"
            >
              Bulletin
            </p>
          </Link>
          <p
            onClick={closeHandler}
            className="btn btn-ghost no-animation btn-xl w-full  text-base-content"
          >
            CAPSTONE
          </p>
          <p
            onClick={closeHandler}
            className="btn btn-ghost no-animation btn-xl w-full  text-base-content mt-10"
          >
            about us
          </p>
        </motion.div>
      </motion.main>
    </>
  );
};

const Navbar = (e) => {
  const [sideMenuOpen, setSideMenuOpen] = useState(false);

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

      <div className="flex justify-center fixed w-full z-40 select-none bg-base-100">
        <nav className="navbar w-full max-w-2xl py-10 items-center px-5 md:px-0">
          <div className="navbar-start">
            <Link href={'/'}>
              <p className="text-2xl">Ingo</p>
            </Link>
          </div>
          {/* desktop links */}
          <div className="navbar-end gap-10 hidden md:flex">
            <Link href={'/blog'}>
              <p className="btn btn-link text-base-content">Blog</p>
            </Link>
            <Link href={'/bulletin'}>
              <p className="btn btn-link text-base-content">Bulletin</p>
            </Link>
            <Link href={'/capstone'}>
              <p className="btn btn-link text-base-content">CAPSTONE</p>
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
