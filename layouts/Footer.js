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
    { label: "CS Council Facebook", href: "#" },
    { label: "Registrar's Office", href: "#" },
    { label: "Supreme Student Council", href: "#" },
    { label: "TNC of the North", href: "#" },
  ],
  External: [
    { label: "UCC Website", href: "https://uccalookca.edu.ph" },
    { label: "UCC Alumnus", href: "#" },
  ],
};

const socialLinks = [
  { icon: SiFacebook, label: "Facebook", href: "#" },
  { icon: SiDiscord, label: "Discord", href: "#" },
  { icon: SiGithub, label: "Github", href: "#" },
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
              <span className="font-sans font-semibold text-[1.45rem] tracking-tight text-white">
                uccingo
              </span>
            </Link>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="flex flex-col gap-2 md:gap-[1rem] col-span-1">
              <h4 className="text-[#434343] text-[1rem] font-normal leading-relaxed">
                {category}
              </h4>
              <ul className="flex flex-col gap-[0.45rem]">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[#8C8C8C] text-[1rem] font-normal hover:text-white transition-colors leading-relaxed"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="flex flex-col gap-2 md:gap-[1rem] col-span-1">
            <h4 className="text-[#434343] text-[1rem] font-normal leading-relaxed">
              Social
            </h4>
            <ul className="flex flex-col gap-[0.45rem]">
              {socialLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[#8C8C8C] text-[1rem] font-normal hover:text-white transition-colors flex items-center gap-[0.8rem] leading-relaxed group"
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

        {/* Copyright Text */}
        <div className="text-[1rem] font-sans font-normal leading-tight text-[#434343] pb-8 md:pb-[3.4rem]">
          @ 2026 CS Council and Technical Committee. All rights reserved
        </div>
      </div>

      {/* Giant Typography Section */}
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
