import Head from "@/components/Head";
import Hero from "@/layouts/Hero";
import HeroFooterStripe from "@/layouts/HeroFooterStripe";
import CSBotSection from "@/layouts/CSBotSection";
import FeaturesList from "@/layouts/FeaturesList";
import AwardsSection from "@/layouts/AwardsSection";
import Stripe from "@/layouts/Stripe";
import AwardGallery from "@/layouts/AwardGallery";
import SectionStripe from "@/components/SectionStripe";
import LatestOnIngo from "@/layouts/LatestOnIngo";
import Council from "@/layouts/Council";
import FAQ from "@/layouts/FAQ";
import HappyCodingSection from "@/layouts/HappyCodingSection";
import { usePrefetcher } from "@/components/Prefetcher";

export default function Home() {
  const { blogs, thesis, bulletins } = usePrefetcher();
  return (
    <>
      <Head
        title="Home | Ingo"
        description="Your CS Information Board on the Go. Stay updated with BSCS program news, blogs, bulletins, and thesis projects."
        url="/"
      />

      <Hero />
      <HeroFooterStripe />
      <CSBotSection />
      <FeaturesList />
      <AwardsSection />
      <Stripe className="mt-0 mb-0" />
      <AwardGallery />
      <SectionStripe className="mt-[4rem]" />
      <LatestOnIngo
        blog={blogs?.[0]}
        thesis={thesis?.[0]}
        bulletin={bulletins?.[0]}
      />
      <SectionStripe className="mt-[5rem]" />
      <Council />
      <SectionStripe className="mt-[2rem] md:mt-[3rem]" />
      <FAQ />
      <HappyCodingSection />
    </>
  );
}
