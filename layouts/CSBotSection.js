import Image from "next/image";

export default function CSBotSection() {
  return (
    <section className="relative section-container px-6 md:px-12 lg:px-[6rem] mt-6 lg:mt-[2.5rem] mb-10 lg:mb-[4rem] font-sans">
      <div className="flex flex-col items-center justify-center text-center gap-2 lg:gap-[0.6rem]">
        <div className="relative w-[160px] h-[160px] md:w-[180px] md:h-[180px]">
          <Image
            src="/mascot/cs-bot.png"
            alt="CS Bot"
            fill
            className="object-contain"
          />
        </div>
        <h2 className="text-2xl md:text-3xl lg:text-[2.2rem] font-bold text-[var(--color-text)] leading-[1.1] tracking-[0.34%] max-w-[20ch] md:max-w-[16ch] lg:max-w-[20ch]">
          See what{" "}
          <span className="font-minecraft text-[#FF5154] font-normal">
            Ingo
          </span>{" "}
          has to offer
        </h2>
        <p className="text-[#EFEFEF] text-sm md:text-[1rem] lg:text-[1.1rem] max-w-[25ch] md:max-w-[35ch] lg:max-w-[50ch] leading-relaxed font-normal">
          Explore projects, people, and the bscs community
        </p>
      </div>
    </section>
  );
}
