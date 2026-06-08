import { useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useInView } from "motion/react";

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
    question: "What kind of projects can I work on?",
    answer:
      "You can work on anything from web apps and mobile apps to AI, games, or even hardware-related projects. As long as it’s tech-related, it’s good.",
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
    <div className="border-b border-[#2A2A2A] overflow-hidden px-6 md:px-12 lg:px-0">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between py-[0.9rem] lg:py-[1.4rem] text-left group transition-colors"
      >
        <span className="text-base md:text-lg lg:text-[1.25rem] font-semibold text-white tracking-wide transition-colors group-hover:text-white/80 pr-4">
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
            <div className="pb-[1.1rem] pt-0 text-[#8C8C8C] text-sm md:text-[1rem] lg:text-[1.1rem] leading-relaxed font-normal max-w-[85ch]">
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
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section
      ref={ref}
      className="relative section-container px-6 md:px-12 lg:px-[6rem] mt-8 md:mt-10 lg:mt-[3rem] mb-12 lg:mb-[6rem] font-sans flex flex-col items-center"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="flex flex-col w-full md:w-[54rem] mx-auto"
      >
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-[0.8rem] mb-8 md:mb-[2rem]">
          <div className="relative w-[100px] h-[100px] md:w-[80px] md:h-[80px] md:w-[110px] md:h-[110px] shrink-0">
            <Image
              src="/mascot/study-bot.png"
              alt="Study Bot"
              fill
              className="object-contain"
            />
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-[2.2rem] text-center md:text-left lg:text-left font-bold text-[var(--color-text)] leading-[1.1] tracking-[0.34%] max-w-[14ch] md:max-w-none">
            Frequently Asked Questions
          </h2>
        </div>

        {/* FAQ Accordion List */}
        <div className="flex flex-col -mx-6 md:-mx-12 lg:mx-0">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.1 * index, ease: "easeOut" }}
            >
              <FAQItem
                faq={faq}
                isOpen={index === openIndex}
                onClick={() => setOpenIndex(index === openIndex ? -1 : index)}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
