import Link from 'next/link';
import { Typography } from '@material-tailwind/react';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <>
      <main className="pb-10 pt-5 flex justify-center px-5 lg:px-0 z-40">
        <section className="w-full max-w-4xl flex flex-col gap-4">
          <div className="flex flex-col lg:flex-row lg:justify-between text-center lg:text-left">
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
            <p>Copyright &copy;2022</p>
          </div>
          <div className="flex flex-col lg:flex-row lg:justify-between mt-7 text-center lg:text-right">
            <p className="text-lg font-bold">Links</p>
            <div className="grid grid-cols-1 lg:grid-cols-3 mt-4 lg:mt-0 gap-7 lg:gap-10 ">
              <div>
                <p className="font-semibold">Internal Links</p>
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
                <Link href="/about" scroll={false}>
                  <Typography className="hover:underline underline-offset-2 cursor-pointer">
                    About
                  </Typography>
                </Link>
                <Link href="/contact" scroll={false}>
                  <Typography className="hover:underline underline-offset-2 cursor-pointer">
                    Contact
                  </Typography>
                </Link>
              </div>
              <div className="text-grey-900">
                <p className="font-semibold">Social Links</p>
                <Typography className="hover:underline underline-offset-2 cursor-pointer">
                  Facebook
                </Typography>
              </div>
              <div>
                <p className="font-semibold">External Links</p>
                <Typography className="hover:underline underline-offset-2 cursor-pointer">
                  UCC Website
                </Typography>
                <Typography className="hover:underline underline-offset-2 cursor-pointer">
                  UCC Registrar
                </Typography>
                <Typography className="hover:underline underline-offset-2 cursor-pointer">
                  UCC SSC
                </Typography>
                <Typography className="hover:underline underline-offset-2 cursor-pointer">
                  UCC TNC of the North
                </Typography>
              </div>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row lg:justify-between text-grey-800 mt-10  text-center lg:text-left">
            <p>Under the management of UCC North Computer Science Council</p>
          </div>
        </section>
      </main>
    </>
  );
};

export default Footer;
