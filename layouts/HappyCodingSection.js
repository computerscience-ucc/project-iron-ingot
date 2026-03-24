import Image from "next/image";

export default function HappyCodingSection() {
  return (
    <section className="relative w-full bg-[#1B1B1B] py-16 md:py-[8rem]">
      {/* Centered Content Container */}
      <div className="section-container px-6 md:px-12 lg:px-[6rem]">
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-[4rem]">
          {/* Graduation Bot Image */}
          <div className="relative w-[180px] h-[180px] md:w-[280px] md:h-[280px]">
            <Image
              src="/mascot/grad-bot.png"
              alt="Graduation Bot"
              fill
              className="object-contain"
            />
          </div>

          {/* Typography */}
          <h2 className="font-minecraft text-center md:text-left text-white text-4xl md:text-[3.5rem] tracking-wider uppercase leading-none mt-4">
            HAPPY CODING!
          </h2>
        </div>
      </div>
    </section>
  );
}
