import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { client } from "@/lib/sanity";
import OfficerCard from "../components/Home/MeetCouncil/OfficerCard";
import CouncilParallaxText from "../components/Home/MeetCouncil/CouncilParallaxText";
import CouncilAbout from "../components/Home/MeetCouncil/CouncilAbout";

const COUNCIL_QUERY = `
  *[_type == 'council' && isCurrent == true][0] {
    "adviser": {
      "name": adviser.name,
      "photo": adviser.photo.asset->url
    },
    "president": {
      "name": president.name,
      "photo": president.photo.asset->url
    },
    "vicePresident": {
      "name": vicePresident.name,
      "photo": vicePresident.photo.asset->url
    },
    officers[] {
      name, position,
      "photo": photo.asset->url
    }
  }
`;

export default function Council() {
  const [council, setCouncil] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    client.fetch(COUNCIL_QUERY).then((data) => setCouncil(data));
  }, []);

  const adviser = council?.adviser;
  const executives = [
    council?.president && {
      name: council.president.name,
      role: "President",
      photo: council.president.photo,
    },
    council?.vicePresident && {
      name: council.vicePresident.name,
      role: "Vice President",
      photo: council.vicePresident.photo,
    },
  ].filter(Boolean);
  const officersList = (council?.officers || []).map((o) => ({
    name: o.name,
    role: o.position,
    photo: o.photo,
  }));

  const next = () => {
    if (currentIndex < officersList.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const prev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="w-full">
      <CouncilParallaxText />

      <div className="w-full flex flex-col items-center">
        {/* Adviser Section */}
        <section className="relative section-container px-6 md:px-12 lg:px-[6rem] mt-[1.4rem] font-sans flex flex-col items-center">
          <h3 className="text-2xl md:text-[1.6rem] font-semibold text-white leading-tight tracking-wide mb-[1.5rem]">
            Adviser
          </h3>

          <div className="relative w-full max-w-[20rem] md:max-w-[28rem] aspect-square bg-[#242424] border border-dashed border-[#8E8E8E] flex items-center justify-center overflow-hidden">
            {/* Corner alignment markers */}
            <div className="absolute top-[-1px] left-[-1px] w-[8px] h-[8px] bg-[#FF5154] z-10"></div>
            <div className="absolute top-[-1px] right-[-1px] w-[8px] h-[8px] bg-[#FF5154] z-10"></div>
            <div className="absolute bottom-[-1px] left-[-1px] w-[8px] h-[8px] bg-[#FF5154] z-10"></div>
            <div className="absolute bottom-[-1px] right-[-1px] w-[8px] h-[8px] bg-[#FF5154] z-10"></div>
            {adviser?.photo && (
              <Image
                src={adviser.photo}
                alt={adviser.name}
                fill
                className="object-cover"
              />
            )}
          </div>

          <div className="flex flex-col items-center mt-[1.2rem] gap-1">
            <h4 className="text-[1.6rem] font-semibold text-white leading-[1.2] tracking-wide">
              {adviser?.name || "—"}
            </h4>
            <p className="text-[#8C8C8C] text-[1rem] leading-relaxed font-normal">
              Council Adviser
            </p>
          </div>
        </section>

        {/* Officers Section */}
        <section className="relative section-container px-6 md:px-12 lg:px-[6rem] mt-8 md:mt-[3.4rem] mb-[2rem] font-sans">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-[6rem]">
            {/* Executive Column */}
            <div className="flex flex-col">
              <h3 className="text-2xl md:text-[1.6rem] font-semibold text-white leading-tight tracking-wide mb-6 md:mb-[2rem]">
                Executive
              </h3>
              <div className="grid grid-cols-2 lg:flex gap-4 lg:gap-[1.5rem]">
                {executives.map((exec, idx) => (
                  <OfficerCard
                    key={idx}
                    name={exec.name}
                    role={exec.role}
                    photo={exec.photo}
                  />
                ))}
              </div>
            </div>

            {/* Officers Column */}
            <div className="flex flex-col flex-1 overflow-hidden">
              <div className="flex items-center justify-between mb-6 md:mb-[2rem] pr-2">
                <h3 className="text-2xl md:text-[1.6rem] font-semibold text-white leading-tight tracking-wide">
                  Officers
                </h3>
                <div className="flex gap-2">
                  <Button
                    onClick={prev}
                    className={`w-10 h-10 flex items-center justify-center rounded-[4px] border-none shadow-none ${
                      currentIndex === 0
                        ? "bg-[#333333] text-gray-600 cursor-not-allowed"
                        : "bg-[#F02E31] text-white hover:bg-[#F02E31]/90"
                    }`}
                    disabled={currentIndex === 0}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m15 18-6-6 6-6" />
                    </svg>
                  </Button>
                  <Button
                    onClick={next}
                    className={`w-10 h-10 flex items-center justify-center rounded-[4px] border-none shadow-none ${
                      currentIndex >= officersList.length - 1
                        ? "bg-[#333333] text-gray-600 cursor-not-allowed"
                        : "bg-[#F02E31] text-white hover:bg-[#F02E31]/90"
                    }`}
                    disabled={currentIndex >= officersList.length - 1}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </Button>
                </div>
              </div>

              {/* Carousel Slider */}
              <div className="relative w-full flex-1">
                <motion.div
                  className="flex gap-4 lg:gap-[1.5rem]"
                  animate={{ x: `calc(-${currentIndex} * (18rem + 1rem))` }}
                  transition={{ type: "spring", stiffness: 350, damping: 35 }}
                >
                  {officersList.map((officer, idx) => (
                    <OfficerCard
                      key={idx}
                      name={officer.name}
                      role={officer.role}
                      photo={officer.photo}
                    />
                  ))}
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <CouncilAbout />
    </div>
  );
}
