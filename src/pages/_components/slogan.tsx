import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const words = [
  { th: "แม่นยำ", en: "Accuracy" },
  { th: "กระชับ", en: "Concise" },
  { th: "ฉับไว", en: "Swiftly" },
];

export const Slogan = () => {
  return (
    <div className="flex items-stretch justify-center space-y-4 gap-4">
      {words.map((word, index) => (
        <motion.div
          className={cn(
            "text-center flex items-center justify-center flex-col h-full pr-4",
            index < words.length - 1 ? "border-r-2 border-border" : "",
          )}
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: index * 0.3 }}
          viewport={{ amount: 0.3, once: true }}
        >
          <p
            className={cn(
              "w-full block text-4xl md:text-5xl font-bold text-accent text-center",
            )}
          >
            {word.th}
          </p>
          <span className="text-lg md:text-xl text-accent/60 mt-2">
            {word.en}
          </span>
        </motion.div>
      ))}
    </div>
  );
};
