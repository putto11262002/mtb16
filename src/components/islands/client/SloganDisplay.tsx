import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const words = [
  { th: "แม่นยำ", en: "Accuracy" },
  { th: "กระชับ", en: "Concise" },
  { th: "ฉับไว", en: "Swiftly" },
];

export function SloganDisplay() {
  const [visibleWords, setVisibleWords] = useState<number[]>([]);

  useEffect(() => {
    words.forEach((_, index) => {
      setTimeout(() => {
        setVisibleWords((prev) => [...prev, index]);
      }, index * 1000);
    });
  }, []);

  return (
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
  );
}

export default SloganDisplay;

