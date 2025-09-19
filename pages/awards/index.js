import { useEffect, useState } from "react";
import Head from "../../components/Head";
import { _Transition_Page } from "../../components/_Animations";
import { motion } from "framer-motion";
import TopGradient from "../../components/TopGradient";

// Awards data
const awards = [
  {
    id: 1,
    title: "Porsche 911",
    year: 2023,
    image: "/awards-imgs/test.png",
    description: "Recognized as the best car ever made.",
  },
  {
    id: 2,
    title: "Best Picks",
    year: 2022,
    image: "/awards-imgs/test3.png",
    description: "Lamers",
  },

  {
    id: 4,
    title: "lamaw",
    year: 2021,
    image: "/awards-imgs/lamer.png",
    description: "abcdefghijklmnopqrstu",
  },
  {
    id: 5,
    title: "Red Bull Gives You Wings",
    year: 2021,
    image: "/awards-imgs/test77.png",
    description: "maxverstappen.com",
  },
  {
    id: 6,
    title: "Spiderman half chinese",
    year: 2021,
    image: "/awards-imgs/test10.png",
    description: "got stung by a radioactive spider.",
  },
  {
    id: 6,
    title: "Spiderman half chinese",
    year: 2021,
    image: "/awards-imgs/test10.png",
    description: "got stung by a radioactive spider.",
  },
  {
    id: 2,
    title: "Best Picks",
    year: 2022,
    image: "/awards-imgs/test3.png",
    description: "Lamers",
  },
  {
    id: 3,
    title: "Sinto Final Boss",
    year: 2021,
    image: "/awards-imgs/test33.jpg",
    description: "Raped a dead skeleton.",
  },
      {
    id: 5,
    title: "Red Bull Gives You Wings",
    year: 2021,
    image: "/awards-imgs/test77.png",
    description: "maxverstappen.com",
  },
  {
    id: 4,
    title: "lamaw",
    year: 2021,
    image: "/awards-imgs/lamer.png",
    description: "abcdefghijklmnopqrstu",
  },
   {
    id: 1,
    title: "Porsche 911",
    year: 2023,
    image: "/awards-imgs/test.png",
    description: "Recognized as the best car ever made.",
  },

  
];

const Awards = () => {
 return (
    <>
      <TopGradient colorLeft={'#fd0101'} colorRight={'#a50000'} />
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
          <p className="text-4xl font-semibold">Achievements And Awards Gallery </p>
          <p className="text-lg font-semibold">
            Celebrating excellence in the BSCS Program
          </p>
        </div>
        
        {/* Masonry layout */}
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
          {awards.map((award) => (
            <div
              key={award.id}
              className="relative break-inside-avoid bg-black rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition"
            >
              {award.image ? (
                <img
                  src={award.image}
                  alt={award.title}
                  className="w-full h-auto object-cover"
                />
              ) : (
                <div className="w-full h-[300px] flex items-center justify-center bg-gray-200 text-gray-500 text-sm">
                  No image inserted yet
                </div>
              )}

              {/* Gradient + Panel */}
              <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/90 to-transparent p-4">
                <h2 className="text-lg font-semibold text-white">{award.title}</h2>
                <p className="text-sm text-gray-300">{award.year}</p>
                <p className="mt-2 text-gray-200 text-sm">{award.description}</p>
              </div>
            </div>
          ))}
        </div>

      </motion.main>
    </>
  );
};

export default Awards;
