import Image from "next/image";
import Link from "next/link";
import { SiFacebook, SiDiscord, SiGithub } from "react-icons/si";

const footerLinks = {
  Uccingo: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Thesis", href: "/thesis" },
    { label: "Awards", href: "/awards" },
    { label: "Bulletin", href: "/bulletin" },
  ],
  UCC: [
    { label: "CS Council Facebook", href: "https://www.facebook.com/UCCBSCS2022" },
    { label: "Registrar's Office", href: "https://facebook.com/uccregistrarnorth" },
    { label: "Supreme Student Council", href: "https://facebook.com/uccsscouncil" },
    { label: "TNC of the North", href: "https://facebook.com/TNCoftheNorthOfficial" },
  ],
  External: [
    { label: "UCC Website", href: "https://www.ucc-caloocan.edu.ph" },
    { label: "UCC Alumnus", href: "https://ucc-alumnus.vercel.app" },
  ],
};

const socialLinks = [
  { icon: SiFacebook, label: "Facebook", href: "https://www.facebook.com/UCCBSCS2022" },
  { icon: SiDiscord, label: "Discord", href: "https://discord.com/invite/krnGXBmp3h" },
  { icon: SiGithub, label: "Github", href: "https://github.com/computerscience-ucc/project-iron-ingot" },
];

export default function Footer() {
  return (
    <footer className="relative w-full overflow-hidden font-sans">
      <div className="section-container px-6 md:px-12 lg:px-[9.5rem] pt-8 md:pt-[2.8rem] pb-0 flex flex-col">
        {/* Main Grid Layout */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-[3.5fr_1fr_1.5fr_1fr_1fr] gap-y-5 md:gap-y-10 gap-x-4 lg:gap-[2rem] w-full pb-6 md:pb-[2rem] mb-0">
          {/* Logo Column */}
          <div className="flex flex-col col-span-2 md:col-span-4 lg:col-span-1">
            <Link
              href="/"
              className="flex items-center gap-[0.8rem] group cursor-pointer w-fit"
            >
              <Image
                className="w-8 h-8 [filter:brightness(0)_invert(var(--logo-invert,0))] group-hover:opacity-80 transition-opacity"
                src="/branding/logo.svg"
                alt="Logo"
                width={32}
                height={32}
              />
              <span className="font-sans font-semibold text-[1.25rem] md:text-[1.45rem] tracking-normal text-white">
                uccingo
              </span>
            </Link>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="flex flex-col gap-1 md:gap-[1rem] col-span-1">
              <h4 className="text-[#434343] text-[0.85rem] md:text-[1rem] font-normal leading-relaxed">
                {category}
              </h4>
              <ul className="flex flex-col gap-[0.35rem] md:gap-[0.45rem]">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[#8C8C8C] text-[0.85rem] md:text-[1rem] font-normal hover:text-white transition-colors leading-relaxed"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="flex flex-col gap-1 md:gap-[1rem] col-span-1">
            <h4 className="text-[#434343] text-[0.85rem] md:text-[1rem] font-normal leading-relaxed">
              Social
            </h4>
            <ul className="flex flex-col gap-[0.35rem] md:gap-[0.45rem]">
              {socialLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[#8C8C8C] text-[0.85rem] md:text-[1rem] font-normal hover:text-white transition-colors flex items-center gap-[0.8rem] leading-relaxed group"
                    >
                      <Icon
                        size={18}
                        className="text-[#515151] group-hover:text-white transition-colors"
                      />
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Contact & Copyright */}
        <div className="flex flex-col gap-2 pb-8 md:pb-[3.4rem] pt-[1.5rem] md:pt-[2rem]">
          <p className="text-[0.85rem] md:text-[1rem] font-sans font-normal text-[#8C8C8C]">
            Questions & Suggestions?{" "}
            <a
              href="mailto:ucc.computersciencecouncil@gmail.com"
              className="text-[#FF5154] hover:underline underline-offset-4 transition-all"
            >
              Email us
            </a>
          </p>
          <div className="text-[0.85rem] md:text-[1rem] font-sans font-normal leading-tight text-[#434343]">
            @ 2026 CS Council and Technical Committee. All rights reserved
          </div>
        </div>
      </div>

      {/* Giant Typography Section */}
      <div className="relative w-full overflow-hidden">
        {/* Dashed Border right above the huge text */}
        <div className="absolute top-0 left-0 w-full border-dashed-long-h text-[var(--color-border-dashed)]"></div>

        <div className="section-container h-full flex justify-center">
          <svg
            viewBox="0 -24 1000 140"
            className="w-full h-auto select-none pointer-events-none"
            preserveAspectRatio="xMidYMax meet"
          >
            <text
              x="49%"
              y="160"
              textAnchor="middle"
              className="font-geistPixel fill-[#202020] text-[255px] tracking-[-0.04em] leading-none"
            >
              UCCINGO
            </text>
          </svg>
        </div>
      </div>
    </footer>
  );
}
