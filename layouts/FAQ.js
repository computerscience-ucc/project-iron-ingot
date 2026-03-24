import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";

const faqs = [
  {
    question: "Who can join the CS Club, and are there any requirements?",
    answer:
      "All BS Computer Science students are welcome! Whether you're a freshman or a senior, the only requirement is a passion for learning and building together.",
  },
  {
    question: "How do I get my project featured?",
    answer:
      "You can submit your project through our official Ingo submission form. Selected projects will be featured in the 'Latest on Ingo' section and highlighted during our monthly assemblies.",
  },
  {
    question: "Do you provide training for competitions?",
    answer:
      "Yes! We regularly hold training blocks and mock hackathons for students interested in joining external competitions like Hack4Gov. Reach out to the executive committee for the latest schedule.",
  },
  {
    question: "Is the content beginner-friendly?",
    answer:
      "Absolutely. We structure our content to cater to all skill levels. From basic programming concepts to advanced architectural design, there is always a place to start and grow.",
  },
  {
    question: "How do I stay updated on deadlines?",
    answer:
      "Keep an eye on the moving ticker banner at the top of the site, join our official Discord server, and regularly check the Bulletin section for academic calendar updates and crucial deadlines.",
  },
];

const FAQItem = ({ faq, isOpen, onClick }) => {
  return (
    <div className="border-b border-[#2A2A2A] overflow-hidden">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between py-[1.2rem] text-left group transition-colors"
      >
        <span className="text-[1.4rem] font-semibold text-white tracking-wide transition-colors group-hover:text-white/80 pr-4">
          {faq.question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2, ease: "circOut" }}
          className="text-[#8C8C8C] shrink-0 ml-4 group-hover:text-white transition-colors"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.2, ease: "circOut" }}
          >
            <div className="pb-[1.5rem] pt-0 text-[#8C8C8C] text-[1.1rem] leading-tight font-normal max-w-[85ch]">
              {faq.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(-1);

  return (
    <section className="relative section-container px-6 md:px-12 lg:px-[6rem] mt-10 lg:mt-[3rem] mb-12 lg:mb-[6rem] font-sans">
      <div className="flex flex-col w-full max-w-[900px] mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-[0.8rem] mb-8 md:mb-[2rem] md:-ml-[1.2rem]">
          <div className="relative w-[80px] h-[80px] md:w-[110px] md:h-[110px] shrink-0">
            <Image
              src="/mascot/study-bot.png"
              alt="Study Bot"
              fill
              className="object-contain"
            />
          </div>
          <h2 className="text-3xl md:text-[2.2rem] text-center md:text-left font-bold text-[var(--color-text)] leading-[1.1] tracking-[0.34%]">
            Frequently Asked Questions
          </h2>
        </div>

        {/* Divider above FAQ list */}
        <div className="w-full h-[1px] bg-[#2A2A2A]"></div>

        {/* FAQ Accordion List */}
        <div className="flex flex-col">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              faq={faq}
              isOpen={index === openIndex}
              onClick={() => setOpenIndex(index === openIndex ? -1 : index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
