import Link from 'next/link';

const Footer = (e) => {
  return (
    <>
      <footer className="w-full relative py-10 flex flex-col items-center px-5 md:px-0">
        <div className=" w-full max-w-2xl flex flex-col text-center">
          <p className=" text-2xl font-bold">Ingo</p>
          <p className=" text-lg font-medium">
            Your CS Information Board on the go
          </p>

          {/* links */}
          <div className="w-full font-medium flex flex-col gap-2 lg:gap-0 lg:flex-row lg:justify-around px-10 mt-16 mb-4 underline-offset-4">
            <Link href={'/blog'}>
              <p className="cursor-pointer link">Blog</p>
            </Link>
            <Link href={'/bulletin'}>
              <p className="cursor-pointer link">Bulletin</p>
            </Link>
            <Link href={'/capstone'}>
              <p className="cursor-pointer link">CAPSTONE</p>
            </Link>
            <Link href={'/about'}>
              <p className="cursor-pointer link">About</p>
            </Link>
          </div>
          <div className="w-full font-medium flex flex-col gap-2 lg:gap-0 lg:flex-row lg:justify-around px-10 underline-offset-4 mt-5">
            <p className="cursor-pointer">Contact Us</p>
            <p className="cursor-pointer">Privacy Statement</p>
            <p className="cursor-pointer">Terms and Conditions</p>
          </div>
          <div className="divider" />
          <p className=" mb-4 font-bold">Other UCC Links</p>
          <div className="w-full flex font-medium flex-col gap-2 lg:gap-0 lg:flex-row lg:justify-around px-10 underline-offset-4">
            <Link
              href="https://ucc-enrollmentmanagementsystem.epizy.com"
              passHref
            >
              <p className="link">Enrollment</p>
            </Link>
            <p className="">Escord</p>
            <p className="">ACES</p>

            <Link href="http://www.ucc-thesis.ml/" passHref>
              <p className="link">Thesis</p>
            </Link>
            <Link href="https://ucc-alumnus.vercel.app" passHref>
              <p className="link">Alumnus</p>
            </Link>
          </div>
          <div className="divider" />
          <p className="font-light">
            Under the management of University of Caloocan City - Computer
            Science Council
          </p>
          <p className="font-light"> Project Iron Ingot &copy; 2022</p>
        </div>
      </footer>
    </>
  );
};

export default Footer;
