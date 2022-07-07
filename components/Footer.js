/*
  TODO: [x] fix inaccessible links
  TODO: [x] update footer links to open in a new tab
  TODO: [x] implement motion to footer links

  ? Todo #1 will be inquired to the developers of the 3rd party apps linked to this website
*/

import Link from 'next/link';
import { motion } from 'framer-motion';

const Footer = (e) => {
  return (
    <>
      <div className="divider" />
      {/* new footer layout */}
      <footer className="w-full relative py-10 flex justify-center select-none">
        <div className="w-full flex flex-col md:flex-row md:justify-between max-w-6xl px-5 md:px-10 xl:px-0 gap-10 md:gap-0">
          <div>
            <Link href={'/'} scroll={false}>
              <p className="text-2xl font-bold text-transparent cursor-pointer text-center md:text-left">
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
            <p className="text-center md:text-left">
              Your CS information on the go.
            </p>
          </div>
          <div className="grid grid-cols-1 text-center gap-6 md:flex md:flex-row md:gap-14 lg:gap-16 md:text-right">
            <div>
              <p className="text-xl font-semibold mb-5">Main Links</p>
              <Link scroll={false} href={'./blog'}>
                <p className="cursor-pointer hover:underline hover:underline-offset-2">
                  Blog
                </p>
              </Link>
              <Link scroll={false} href={'./bulletin'}>
                <p className="cursor-pointer hover:underline hover:underline-offset-2">
                  Bulletin
                </p>
              </Link>
              <Link scroll={false} href={'./capstone'}>
                <p className="cursor-pointer hover:underline hover:underline-offset-2">
                  CAPSTONE
                </p>
              </Link>
              <Link scroll={false} href={'./about'}>
                <p className="cursor-pointer hover:underline hover:underline-offset-2">
                  About
                </p>
              </Link>
              <Link scroll={false} href={'./about'}>
                <p className="cursor-pointer hover:underline hover:underline-offset-2">
                  Contact
                </p>
              </Link>
            </div>
            <div>
              <p className="text-xl font-semibold mb-5">Social Links</p>
              <p className="opacity-10">Facebook</p>
            </div>
            <div>
              <p className="text-xl font-semibold mb-5">External Links</p>
              <p className="opacity-10">Official UCC Website</p>
              <p className="opacity-10">UCC - Registrar</p>
              <p className="opacity-10">UCC - SSC</p>
              <p className="opacity-10">UCC - CS Council</p>
              <p className="opacity-10">UCC - TNC of the North</p>
            </div>
          </div>
        </div>
      </footer>
      <div className="w-full relative py-10 flex justify-center select-none">
        <div className="flex flex-col justify-center text-center">
          <p className="font-light">
            Under the management of University of Caloocan City - Computer
            Science Council
          </p>
          <p className="font-light"> Project Iron Ingot &copy; 2022</p>
        </div>
      </div>
    </>
  );
};

export default Footer;
