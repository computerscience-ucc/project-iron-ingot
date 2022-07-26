import { AnimatePresence, AnimateSharedLayout, motion } from 'framer-motion';
import { useState } from 'react';

const NavbarNew = (e) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.div
        whileHover={() => setIsOpen(true)}
        onHoverEnd={() => setIsOpen(false)}
        className={`fixed w-full flex justify-center p-5 ${
          isOpen ? 'h-max' : 'h-auto'
        }`}
      >
        <AnimateSharedLayout>
          <motion.div
            layout
            className="w-full max-w-2xl flex flex-col py-5 bg-base-200 p-5 px-3 md:px-10 rounded-lg"
          >
            <motion.div layout className="flex justify-between items-center">
              <p className="text-2xl">Ingo</p>
              <ul className="flex gap-4 p-0 list-none">
                <li>Blog</li>
                <li>Bulletin</li>
                <li>CAPSTONE</li>
                <li>About</li>
                <li>About</li>
              </ul>
            </motion.div>
            <AnimatePresence exitBeforeEnter>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.25, delay: 0.25 },
                  }}
                  exit={{
                    opacity: 0,
                    transition: { duration: 0.2 },
                  }}
                  className="mt-16 mb-8"
                >
                  <p>aslkdjalksjdklj</p>
                  <p>aslkdjalksjdklj</p>
                  <p>aslkdjalksjdklj</p>
                  <p>aslkdjalksjdklj</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimateSharedLayout>
      </motion.div>
    </>
  );
};

export default NavbarNew;
