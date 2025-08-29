import React, { useState } from 'react';
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";

export default function AwardsCarousel({ images }) {
  const [current, setCurrent] = useState(0);

  const previousSlide = () => {
    setCurrent((prev) => (prev === 0 ? -1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev === images.length - 1 ? images.length : prev + 1));
  };

  return (
    <div className="relative w-full overflow-hidden flex flex-col justify-center">
   
      <div
        className=" flex transition-transform duration-500 ease-out w-full"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {images.map((src, index) => (
           <div
           key={index}
           className=" w-full flex justify-center items-center flex-shrink-0"
         >
           <img
             className="max-h-[500px] w-auto object-contain rounded-xl"
             src={src.src}
             alt=""
           />
         </div>
        ))}
      </div>

      {current > 0 && (<div className="absolute  top-[40%] left-[10%] mt-1 flex  items-start px-4 pointer-events-none">
        <button
          onClick={previousSlide}
          className="text-red-700 hover:text-red-900  rounded-full p-2 text-3xl pointer-events-auto absolute"
        >
          <IoIosArrowBack />
        </button>
      </div>)}

      {current < images.length-1 && (<div className="absolute  top-[40%] right-[16%] mt-1 flex  items-start px-4 pointer-events-none">
        <button
          onClick={nextSlide}
          className="text-red-700 hover:text-red-900 rounded-full p-2 text-3xl pointer-events-auto absolute "
        >
          <IoIosArrowForward />
        </button>
      </div>)}

      <div className="mt-12 flex flex-wrap justify-center gap-3 w-full">
        {images.map((_, i) => (
          <div
            key={i}
            onClick={() => setCurrent(i)}
            className={`text-sm sm:text-base px-3 py-1 rounded-full cursor-pointer transition-colors duration-300 ${
              i === current
                ? 'bg-red-900 text-white font-semibold'
                : 'bg-grey-700 text-black'
            }`}
          >
          </div>
        ))}
      </div>
    </div>
  );
}
