import "../styles/globals.css";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

import ChatBot from "../components/ChatBot";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { PrefetcherWrapper, usePrefetcher } from "../components/Prefetcher";
import { ThemeProvider } from "@material-tailwind/react";
import { useRouter } from "next/router";

// inner app shell with access to Prefetcher context
function AppShell({ Component, pageProps }) {
  const router = useRouter();
  const { siteConfig } = usePrefetcher();

  useEffect(() => {
    const handleRouteChange = () => window.scrollTo(0, 0);
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => router.events.off("routeChangeComplete", handleRouteChange);
  }, [router.events]);

  useEffect(() => {
    if (!siteConfig) return;
    const root = document.documentElement;

    if (siteConfig.colorBackground) root.style.setProperty("--color-background", siteConfig.colorBackground);
    if (siteConfig.colorButton) root.style.setProperty("--color-button", siteConfig.colorButton);
    if (siteConfig.colorButtonText) root.style.setProperty("--color-button-text", siteConfig.colorButtonText);
    if (siteConfig.colorNav) root.style.setProperty("--color-nav", siteConfig.colorNav);
    if (siteConfig.colorHeader) root.style.setProperty("--color-header", siteConfig.colorHeader);
    if (siteConfig.colorTheme) root.style.setProperty("--color-theme", siteConfig.colorTheme);
    if (siteConfig.colorScrollbar) root.style.setProperty("--color-scrollbar", siteConfig.colorScrollbar);
  }, [siteConfig]);

  return (
    <div className="text-gray-100 relative">
      <Navbar />
      <main className="min-h-screen flex justify-center overflow-x-hidden relative">
        <motion.div className="w-full relative max-w-4xl px-5 lg:px-0 ">
          <AnimatePresence mode="wait">
            <Component {...pageProps} key={router.route} />
          </AnimatePresence>
        </motion.div>
      </main>
      <Footer />
      {/* Render ChatBot conditionally */}
      {(!siteConfig || siteConfig.chatbotEnabled !== false) && <ChatBot />}
    </div>
  );
}

function MyApp({ Component, pageProps }) {
  return (
    <>
      <ThemeProvider>
        <PrefetcherWrapper>
          <AppShell Component={Component} pageProps={pageProps} />
        </PrefetcherWrapper>
      </ThemeProvider>
    </>
  );
}

export default MyApp;
