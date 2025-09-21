import { useEffect, useState } from "react";
import Head from "../../components/Head";
import { _Transition_Page } from "../../components/_Animations";
import { motion } from "framer-motion";
import TopGradient from "../../components/TopGradient";


const awards = [
  {
    id: 1,
    title: "Porsche 911",
    year: 2023,
    image: "/awards-imgs/test.png",
    alt: "Award image of Porsche 911",
    description: "Example Portrait Image",
  },
  {
    id: 2,
    title: "Dan-da-Dan",
    year: 2025,
    image: "/awards-imgs/test-landscape.png",
    alt: "Best Frame",
    description: "Example Landscape Image",
  },
  {
    id: 6,
    title: "Spider-man",
    year: 2021,
    image: "/awards-imgs/test10.png",
    alt: "Hero Christmas theme",
    description: "Example square Image",
  },
  {
    id: 10,
    title: "Achievement without Image",
    year: 2025,
    image: "",
    alt: "",
    description: "Example no Image and alt description",
  },
  {
    id: 7,
    title: "Black Raven Championship",
    year: 2024,
    image: "/awards-imgs/test-ach1.jpg",
    alt: "Award image of Black Raven Championship",
    description: "Mythical 5",
  },
   {
    id: 9,
    title: "Drift.gif",
    year: 2025,
    image: "/awards-imgs/testtt.gif",
    alt: "Dream Drift",
    description: "Portrait GIF Example",
  },
  {
    id: 8,
    title: "CSD fair 2025",
    year: 2025,
    image: "/awards-imgs/test-ach2.jpg",
    alt: "Award image of CSD fair 2025",
    description: "Hardware Craft 4th Place",
  },
 {
    id: 9,
    title: "Redbull F1",
    year: 2025,
    image: "/awards-imgs/testw.png",
    alt: "F1's Best Team",
    description: "Portrait Image Example",
  },

];

const Awards = () => {
  return (
    <>
      <TopGradient colorLeft={"#fd0101"} colorRight={"#a50000"} />
      <Head
        title="Awards | Ingo"
        description="Celebrating excellence in the BSCS Program"
        url="/awards"
      />

      <motion.main
        variants={_Transition_Page}
        initial="initial"
        animate="animate"
        exit="exit"
        className="py-36 z-10"
      >
        {/* Page Title */}
        <div className="flex flex-col gap-2 justify-center mt-16 mb-12">
          <p className="text-4xl font-semibold">
            Achievements And Awards Gallery
          </p>
          <p className="text-lg font-semibold">
            Celebrating excellence in the BSCS Program
          </p>
        </div>

        {/* Masonry layout */}
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
          {awards.map((award) => (
            <div
              key={award.id}
              className="relative group break-inside-avoid bg-black rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition"
            >
              {award.image ? (
                <img
                  src={award.image}
                  alt={award.alt || award.title}
                  className="w-full h-auto object-cover"
                />
              ) : (
                <div className="w-full h-[340px] flex flex-col items-center justify-center bg-gray-200 text-center p-4">
                  <img
                    src="/awards-imgs/logo.svg"
                    alt="Logo"
                    className="w-16 h-16 object-contain opacity-70 mb-2"
                  />
                  <h2 className="text-sm font-semibold text-gray-800">
                    {award.title}
                  </h2>
                  <p className="text-gray-600 text-xs mt-1">
                    {award.alt || "No image available – awaiting upload"}
                  </p>
                  <p className="text-gray-600 text-xs mt-1">
                    {award.description}
                  </p>
                </div>
              )}

              {/* Hover= Gradient + Title + Year + Description */}
              <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-black to-black/40 opacity-0 group-hover:opacity-100 transition duration-500">
                <div className="p-2">
                  <h2 className="text-sm font-semibold text-white">
                    {award.title}
                  </h2>
                  <p className="text-xs text-gray-300">{award.year}</p>
                </div>

                {/* Description at the bottom */}
                <div className="p-4">
                  <p className="text-gray-200 text-xs">
                    {award.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.main>
    </>
  );
};

export default Awards;
