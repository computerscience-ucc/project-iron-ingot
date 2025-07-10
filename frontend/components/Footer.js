import Link from 'next/link';
import { Typography } from '@material-tailwind/react';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <>
      <main className="pb-10 pt-5 flex justify-center px-5 lg:px-0 z-40">
        <section className="w-full max-w-4xl flex flex-col gap-4">
          <div className="flex flex-col lg:flex-row lg:justify-between mt-7 text-center lg:text-right">
            <p className="text-xl font-bold text-transparent">
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
            <div className="flex flex-col md:flex-row mt-4 lg:mt-0 gap-7 lg:gap-10 ">
              <div>
                <p className="font-semibold mb-2">Internal Links</p>
                <Link href="/blog" scroll={false}>
                  <Typography className="hover:underline underline-offset-2 cursor-pointer">
                    Blog
                  </Typography>
                </Link>
                <Link href="/bulletin" scroll={false}>
                  <Typography className="hover:underline underline-offset-2 cursor-pointer">
                    Bulletin
                  </Typography>
                </Link>
                <Link href="/thesis" scroll={false}>
                  <Typography className="hover:underline underline-offset-2 cursor-pointer">
                    Thesis
                  </Typography>
                </Link>
                <Link href="/about" scroll>
                  <Typography className="hover:underline underline-offset-2 cursor-pointer">
                    About
                  </Typography>
                </Link>
              </div>
              <div>
                <p className="font-semibold mb-2">Social Links</p>
                <a
                  href="https://www.facebook.com/UCCBSCS2022"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Typography className=" hover:underline underline-offset-2 cursor-pointer">
                    CS Council Facebook
                  </Typography>
                </a>
                <a
                  href="https://facebook.com/uccregistrarnorth"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Typography className="hover:underline underline-offset-2 cursor-pointer">
                    Registar&apos;s Office
                  </Typography>
                </a>
                <a
                  href="https://facebook.com/uccsscouncil"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Typography className="hover:underline underline-offset-2 cursor-pointer">
                    Supreme Student Council
                  </Typography>
                </a>
                <a
                  href="https://facebook.com/TNCoftheNorthOfficial"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Typography className="hover:underline underline-offset-2 cursor-pointer">
                    TNC of the North
                  </Typography>
                </a>
              </div>
              <div>
                <p className="font-semibold mb-2">External Links</p>
                <a
                  href="https://www.ucc-caloocan.edu.ph"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Typography className="hover:underline underline-offset-2 cursor-pointer">
                    UCC Website
                  </Typography>
                </a>
                <a
                  href="https://ucc-alumnus.vercel.app"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Typography className="hover:underline underline-offset-2 cursor-pointer">
                    UCC Alumnus
                  </Typography>
                </a>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center lg:flex-row lg:justify-between text-grey-400 mt-4 text-center lg:text-left">
            <p className="flex gap-2 ">
              Questions &amp; Suggestions?{' '}
              <span>
                <a
                  href="mailto:ucc.computersciencecouncil@gmail.com"
                  className="hover:underline underline-offset-2 cursor-pointer"
                >
                  Email us by clicking here
                </a>
              </span>
            </p>
          </div>
          <div className="flex flex-col lg:flex-row lg:justify-between text-grey-800 mt-10  text-center lg:text-left">
            <p>Under the management of UCC North Computer Science Council</p>
            <p>Copyright &copy;2023</p>
          </div>
        </section>
      </main>
    </>
  );
};

export default Footer;
