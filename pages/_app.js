import "@/styles/globals.css";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { PrefetcherWrapper, usePrefetcher } from "../components/Prefetcher";
import ChatBot from "../components/ChatBot";
import SearchModal from "../components/SearchModal";
import { SiDiscord, SiFacebook, SiGithub } from "react-icons/si";
import SectionStripe from "@/components/SectionStripe";
import Footer from "@/layouts/Footer";

import { Search, X } from "@geist-ui/icons";
import { motion, useScroll, useMotionValueEvent } from "motion/react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const AppChatBot = () => {
  const { siteConfig } = usePrefetcher();
  return !siteConfig || siteConfig.chatbotEnabled !== false ? (
    <ChatBot />
  ) : null;
};

function AppInner({ Component, pageProps }) {
  const router = useRouter();
  const { blogs } = usePrefetcher();
  const [theme, setTheme] = useState("dark");
  const [showGrid, setShowGrid] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [yPos, setYPos] = useState(0);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    // Hide immediately when scrolling down
    // Show back immediately when scrolling up
    if (latest > previous && latest > 0) {
      setYPos("-100%");
    } else {
      setYPos("0%");
    }
  });

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));
  const toggleGrid = () => setShowGrid((s) => !s);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    const handleKeydown = (e) => {
      const key = e.key.toLowerCase();
      if (e.shiftKey && (key === "g" || e.code === "KeyG")) toggleGrid();
      if (e.shiftKey && (key === "t" || e.code === "KeyT")) toggleTheme();
      if (e.ctrlKey && key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, []);

  const navLinks = [
    { href: "/blog", label: "Blog", hasChevron: true },
    { href: "/bulletin", label: "Bulletin" },
    { href: "/thesis", label: "Thesis", hasChevron: true },
    { href: "/awards", label: "Awards" },
    { href: "/gallery", label: "Gallery" },
    { href: "/about", label: "About" },
  ];

  return (
    <>
      <div className="app-root">
        {showBanner && (
          <div className="w-full bg-[#FF3538] h-[2rem] flex items-center px-2 relative z-[100] transition-all duration-300 overflow-hidden group">
            <motion.div
              className="flex whitespace-nowrap gap-2 pr-12"
              initial={{ x: "-50%" }}
              animate={{ x: "0%" }}
              transition={{ repeat: Infinity, ease: "linear", duration: 90 }}
            >
              {[...Array(2)].map((_, groupIndex) => (
                <div key={groupIndex} className="flex items-center gap-4">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                      {[
                        "📅 Thesis Milestones → Proposal • Implementation • Final Defense",
                        "🎓 BSCS Graduation 2026! Stay updated with important announcements",
                        "📚 Thesis 2026 : Deadlines, proposals, and final defense schedules",
                        "🚀 Celebrate the BSCS Class of 2026",
                      ].map((text, idx) => (
                        <div key={idx} className="flex items-center gap-4">
                          <span className="text-white font-sans font-medium text-[0.875rem]">
                            {text}
                          </span>
                          <span className="text-white">✱</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </motion.div>
            <button
              onClick={() => setShowBanner(false)}
              className="absolute right-0 h-full px-2 bg-[#FF3538] text-white hover:opacity-80 transition-opacity flex items-center justify-center z-10"
              title="Close notification"
            >
              <X size={16} strokeWidth={2.5} />
            </button>
          </div>
        )}

        <Head>
          <link rel="icon" href="/favicon.ico" />
          <title>Ingo</title>
        </Head>

        <motion.header
          className="w-full relative z-[50]"
          style={{
            position: "sticky",
            top: 0,
            background: "var(--color-bg)",
          }}
          initial={{ y: 0 }}
          animate={{ y: yPos }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <div className="stripe-banner absolute inset-0 z-0"></div>
          <div className="absolute bottom-0 left-0 w-full border-dashed-long-h text-[var(--color-border-dashed)]"></div>
          <div className="relative z-[2] h-[4rem] flex items-center justify-between px-[1.4rem] max-w-[var(--container-max-width)] w-[var(--container-width)] mx-auto font-mono font-normal tracking-[0.34%] text-[0.875rem] text-[var(--color-text-muted)]">
            {/* Logo Group */}
            <Link
              href="/"
              className="flex items-center gap-[0.8rem] group cursor-pointer"
            >
              <Image
                className="w-8 h-8 [filter:brightness(0)_invert(var(--logo-invert,0))] group-hover:opacity-80 transition-opacity"
                src="/branding/logo.svg"
                alt="Logo"
                width={32}
                height={32}
                priority
              />
              <span className="whitespace-nowrap font-sans font-semibold text-[1.2rem] tracking-normal text-[var(--color-text)]">
                uccingo
              </span>
            </Link>

            {/* Absolutely Centered Navigation Menu */}
            <div className="absolute left-1/2 -translate-x-1/2 mt-[0.1rem]">
              <NavigationMenu
                viewport={false}
                className="font-sans text-[1rem] z-[100]"
              >
                <NavigationMenuList className="gap-[2rem]">
                  {navLinks.map((link) => {
                    const isActive = router.pathname === link.href;
                    const linkClass = `nav-link flex items-center gap-[0.4rem] cursor-pointer transition-colors duration-200 bg-transparent hover:bg-transparent ${
                      isActive
                        ? "active text-[#FF5154]"
                        : "text-[var(--color-text-muted)] hover:text-[#FF5154]"
                    }`;

                    if (link.label === "Blog") {
                      return (
                        <NavigationMenuItem key={link.href}>
                          <Link href={link.href}>
                            <NavigationMenuTrigger
                              hideIcon
                              className={
                                linkClass +
                                " px-0 py-0 h-auto font-normal data-[state=open]:text-[#FF5154]"
                              }
                            >
                              <span>{link.label}</span>
                              {link.hasChevron && (
                                <svg
                                  width="10"
                                  height="6"
                                  viewBox="0 0 10 6"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="transition-transform duration-300 group-data-[state=open]:-rotate-180"
                                >
                                  <path
                                    d="M1 1L5 5L9 1"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              )}
                            </NavigationMenuTrigger>
                          </Link>
                          <NavigationMenuContent className="p-0 border-none bg-transparent shadow-none absolute top-full left-1/2 -translate-x-1/2 mt-[1px] data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
                            <div className="relative pt-[10px] flex justify-center">
                              {/* SVG Pointer precisely above the card */}
                              <div className="absolute top-[1px] left-1/2 -translate-x-1/2 z-[51]">
                                <svg
                                  width="21"
                                  height="20"
                                  viewBox="0 0 21 20"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M7.03688 2C8.57648 -0.66667 12.4255 -0.666667 13.9651 2L20.4603 13.25C21.9999 15.9167 20.0754 19.25 16.9962 19.25H4.00578C0.926581 19.25 -0.997917 15.9167 0.541684 13.25L7.03688 2Z"
                                    fill="#2A2A2A"
                                  />
                                </svg>
                              </div>
                              <div className="flex gap-[2.5rem] p-[1rem] px-[1.2rem] bg-[#2A2A2A] rounded-[10px] w-max select-none relative z-50">
                                <div className="flex flex-col gap-[0.5rem] min-w-[160px]">
                                  <span className="text-[#8C8C8C] text-sm mb-[0.1rem] font-medium">
                                    Blog Posts
                                  </span>
                                  {blogs?.length > 0 ? (
                                    blogs.slice(0, 5).map((item) => (
                                      <Link
                                        key={item._id}
                                        href={`/blog/${item.slug}`}
                                        className="text-[#EFEFEF] hover:text-[#FF5154] transition-colors text-sm truncate max-w-[400px] block"
                                      >
                                        {item.title}
                                      </Link>
                                    ))
                                  ) : (
                                    <span className="text-[#8C8C8C] text-sm">
                                      No posts available
                                    </span>
                                  )}
                                  <Link
                                    href="/blog"
                                    className="flex items-center gap-[0.4rem] text-[#8C8C8C] hover:text-[#EFEFEF] transition-colors text-sm mt-1 group/more"
                                  >
                                    <div className="flex gap-[0.15rem]">
                                      <span className="w-1 h-1 rounded-full bg-[#8C8C8C] group-hover/more:bg-[#EFEFEF] transition-colors"></span>
                                      <span className="w-1 h-1 rounded-full bg-[#8C8C8C] group-hover/more:bg-[#EFEFEF] transition-colors"></span>
                                      <span className="w-1 h-1 rounded-full bg-[#8C8C8C] group-hover/more:bg-[#EFEFEF] transition-colors"></span>
                                    </div>
                                    More
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </NavigationMenuContent>
                        </NavigationMenuItem>
                      );
                    }

                    if (link.label === "Thesis") {
                      return (
                        <NavigationMenuItem key={link.href}>
                          <Link href={link.href}>
                            <NavigationMenuTrigger
                              hideIcon
                              className={
                                linkClass +
                                " px-0 py-0 h-auto font-normal data-[state=open]:text-[#FF5154]"
                              }
                            >
                              <span>{link.label}</span>
                              {link.hasChevron && (
                                <svg
                                  width="10"
                                  height="6"
                                  viewBox="0 0 10 6"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="transition-transform duration-300 group-data-[state=open]:-rotate-180"
                                >
                                  <path
                                    d="M1 1L5 5L9 1"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              )}
                            </NavigationMenuTrigger>
                          </Link>
                          <NavigationMenuContent className="p-0 border-none bg-transparent shadow-none absolute top-full left-1/2 -translate-x-1/2 mt-[1px] data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
                            <div className="relative pt-[10px] flex justify-center">
                              {/* SVG Pointer precisely above the card */}
                              <div className="absolute top-[1px] left-1/2 -translate-x-1/2 z-[51]">
                                <svg
                                  width="21"
                                  height="20"
                                  viewBox="0 0 21 20"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M7.03688 2C8.57648 -0.66667 12.4255 -0.666667 13.9651 2L20.4603 13.25C21.9999 15.9167 20.0754 19.25 16.9962 19.25H4.00578C0.926581 19.25 -0.997917 15.9167 0.541684 13.25L7.03688 2Z"
                                    fill="#2A2A2A"
                                  />
                                </svg>
                              </div>
                              <div className="flex gap-[2.5rem] p-[1rem] px-[1.2rem] bg-[#2A2A2A] rounded-[10px] w-max select-none relative z-50">
                                <div className="flex flex-col gap-[0.5rem] min-w-[100px]">
                                  <span className="text-[#8C8C8C] text-sm mb-[0.1rem] font-medium">
                                    Academic year
                                  </span>
                                  {[
                                    "2026",
                                    "2025",
                                    "2024",
                                    "2023",
                                    "2022",
                                  ].map((item) => (
                                    <Link
                                      key={item}
                                      href={`/thesis?year=${encodeURIComponent(item)}`}
                                      className="text-[#EFEFEF] hover:text-[#FF5154] transition-colors text-sm"
                                    >
                                      {item}
                                    </Link>
                                  ))}
                                  <Link
                                    href="/thesis"
                                    className="flex items-center gap-[0.4rem] text-[#8C8C8C] hover:text-[#EFEFEF] transition-colors text-sm mt-1 group/more"
                                  >
                                    <div className="flex gap-[0.15rem]">
                                      <span className="w-1 h-1 rounded-full bg-[#8C8C8C] group-hover/more:bg-[#EFEFEF] transition-colors"></span>
                                      <span className="w-1 h-1 rounded-full bg-[#8C8C8C] group-hover/more:bg-[#EFEFEF] transition-colors"></span>
                                      <span className="w-1 h-1 rounded-full bg-[#8C8C8C] group-hover/more:bg-[#EFEFEF] transition-colors"></span>
                                    </div>
                                    More
                                  </Link>
                                </div>
                                <div className="flex flex-col gap-[0.5rem] min-w-[100px]">
                                  <span className="text-[#8C8C8C] text-sm mb-[0.1rem] font-medium">
                                    Department
                                  </span>
                                  {[
                                    "BSCS",
                                    "BSEMC",
                                    "BSIT",
                                    "BSIS",
                                    "Other",
                                  ].map((item) => (
                                    <Link
                                      key={item}
                                      href={`/thesis?department=${encodeURIComponent(item)}`}
                                      className="text-[#EFEFEF] hover:text-[#FF5154] transition-colors text-sm"
                                    >
                                      {item}
                                    </Link>
                                  ))}
                                  <Link
                                    href="/thesis"
                                    className="flex items-center gap-[0.4rem] text-[#8C8C8C] hover:text-[#EFEFEF] transition-colors text-sm mt-1 group/more"
                                  >
                                    <div className="flex gap-[0.15rem]">
                                      <span className="w-1 h-1 rounded-full bg-[#8C8C8C] group-hover/more:bg-[#EFEFEF] transition-colors"></span>
                                      <span className="w-1 h-1 rounded-full bg-[#8C8C8C] group-hover/more:bg-[#EFEFEF] transition-colors"></span>
                                      <span className="w-1 h-1 rounded-full bg-[#8C8C8C] group-hover/more:bg-[#EFEFEF] transition-colors"></span>
                                    </div>
                                    More
                                  </Link>
                                </div>
                                <div className="flex flex-col gap-[0.5rem] min-w-[125px] pr-2">
                                  <span className="text-[#8C8C8C] text-sm mb-[0.1rem] font-medium">
                                    Categories
                                  </span>
                                  {[
                                    "Blockchain",
                                    "IoT",
                                    "OS",
                                    "ML/AI",
                                    "CyberSec",
                                  ].map((item) => (
                                    <Link
                                      key={item}
                                      href={`/thesis?category=${encodeURIComponent(item)}`}
                                      className="text-[#EFEFEF] hover:text-[#FF5154] transition-colors text-sm"
                                    >
                                      {item}
                                    </Link>
                                  ))}
                                  <Link
                                    href="/thesis"
                                    className="flex items-center gap-[0.4rem] text-[#8C8C8C] hover:text-[#EFEFEF] transition-colors text-sm mt-1 group/more"
                                  >
                                    <div className="flex gap-[0.15rem]">
                                      <span className="w-1 h-1 rounded-full bg-[#8C8C8C] group-hover/more:bg-[#EFEFEF] transition-colors"></span>
                                      <span className="w-1 h-1 rounded-full bg-[#8C8C8C] group-hover/more:bg-[#EFEFEF] transition-colors"></span>
                                      <span className="w-1 h-1 rounded-full bg-[#8C8C8C] group-hover/more:bg-[#EFEFEF] transition-colors"></span>
                                    </div>
                                    More
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </NavigationMenuContent>
                        </NavigationMenuItem>
                      );
                    }

                    return (
                      <NavigationMenuItem key={link.href}>
                        <Link href={link.href} legacyBehavior passHref>
                          <NavigationMenuLink className={linkClass}>
                            <span>{link.label}</span>
                            {link.hasChevron && (
                              <svg
                                width="10"
                                height="6"
                                viewBox="0 0 10 6"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M1 1L5 5L9 1"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            )}
                          </NavigationMenuLink>
                        </Link>
                      </NavigationMenuItem>
                    );
                  })}
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            {/* Actions Group */}
            <div className="flex items-center justify-end gap-[1.2rem]">
              {/* <div
                className="theme-switch"
                onClick={toggleTheme}
                title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              >
                <div className="theme-switch-thumb">
                  {theme === "dark" ? (
                    <Image
                      src="/moon.svg"
                      className="theme-switch-icon"
                      alt="moon"
                      width={14}
                      height={14}
                    />
                  ) : (
                    <HiSun className="theme-switch-icon" />
                  )}
                </div>
              </div> */}

              <div
                onClick={() => setSearchOpen(true)}
                className="relative group/search w-[160px] font-sans cursor-pointer"
              >
                <Search
                  className="absolute left-2 top-1/2 -translate-y-1/2 group-hover/search:text-[var(--color-text)] transition-colors duration-200"
                  size={20}
                  color="#8C8C8C"
                />
                <div className="pl-8 pr-16 h-[42px] bg-[#1D1D1D] border border-[#333333] rounded-[6px] flex items-center text-[#8C8C8C] text-[1rem] select-none">
                  Search
                </div>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 px-[8px] py-[2px] border border-[#333333] rounded-[4px] bg-[var(--color-bg-secondary)] text-[0.8rem] text-[#8C8C8C] font-sans whitespace-nowrap">
                  Ctrl K
                </div>
              </div>

              <div className="flex items-center gap-[0.2rem] text-[#515151]">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-150 hover:text-[var(--color-text)]"
                >
                  <SiFacebook size={20} />
                </a>
                <a
                  href="https://discord.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-150 hover:text-[var(--color-text)]"
                >
                  <SiDiscord size={20} />
                </a>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-150 hover:text-[var(--color-text)]"
                >
                  <SiGithub size={20} />
                </a>
              </div>
            </div>
          </div>
        </motion.header>

        <div className="fixed inset-0 pointer-events-none z-[-1] flex justify-center">
          <div className="grid grid-cols-12 gap-[1.2rem] h-full max-w-[var(--container-max-width)] w-[var(--container-width)]">
            <div className="col-start-1 border-dashed-long-v text-[var(--color-border-dashed)]"></div>
            <div className="col-start-12 border-dashed-long-v justify-self-end text-[var(--color-border-dashed)]"></div>
          </div>
        </div>

        <main>
          <Component {...pageProps} />
        </main>
        <SectionStripe className="mt-0" />
        <Footer />

        {/* Layout Grids */}
        {showGrid && (
          <div className="fixed inset-0 pointer-events-none z-[99999] flex justify-center">
            <div className="grid grid-cols-12 gap-[1.2rem] h-full max-w-[var(--container-max-width)] w-[var(--container-width)]">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white/[0.03] dark:bg-white/[0.02] border-x border-white/[0.05] dark:border-white/[0.03]"
                ></div>
              ))}
            </div>
          </div>
        )}

        {/* Render ChatBot conditionally */}
        <AppChatBot />

        <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      </div>
    </>
  );
}

export default function App(props) {
  return (
    <PrefetcherWrapper>
      <AppInner {...props} />
    </PrefetcherWrapper>
  );
}
