import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

const words = [
  { th: "แม่นยำ", en: "Accuracy" },
  { th: "กระชับ", en: "Concise" },
  { th: "ฉับไว", en: "Swiftly" },
];

export const Slogan = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Only trigger once
        }
      },
      {
        threshold: 0.3, // Trigger when 30% of the section is visible
        rootMargin: "0px 0px -100px 0px", // Trigger slightly before fully in view
      },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const [visibleWords, setVisibleWords] = useState<number[]>([]);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    words.forEach((_, index) => {
      const timer = setTimeout(() => {
        setVisibleWords((prev) => [...prev, index]);
      }, index * 300);
      timers.push(timer);
    });
    return () => timers.forEach((timer) => clearTimeout(timer));
  }, []);

  return (
    <div
      ref={sectionRef}
      className={`transition-all duration-1000 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <div className="flex items-stretch flex-0 justify-center space-y-4 gap-4">
        {words.map((word, index) => (
          <div
            className={cn(
              "text-center flex items-center justify-center flex-col h-full not-last:border-r-2 pr-4",

              ` transition-opacity duration-500 text-center ${
                visibleWords.includes(index) ? "opacity-100" : "opacity-0"
              }`,
            )}
            key={index}
          >
            <p
              className={cn(
                "w-full block text-3xl md:text-4xl font-bold text-primary text-center",
              )}
            >
              {word.th}
            </p>
            <span className={``} style={{ animationDelay: `${index * 0.2}s` }}>
              {word.en}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
