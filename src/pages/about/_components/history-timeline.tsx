import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface TimelineItem {
  date: string;
  title: string;
  description: string;
}

interface HistoryTimelineProps {
  title?: string;
  items?: TimelineItem[];
}

const defaultTimelineItems: TimelineItem[] = [
  {
    date: "24 กันยายน พ.ศ. 2558",
    title: "มณฑลทหารบกที่ 24 กันยายน พ.ศ. 2558",
    description:
      "กองทัพบกออกคำสั่ง (เฉพาะ) ที่ 36/58 เรื่องแก้อัตราการจัดและยุทโธปกรณ์กองทัพบก (ครั้งที่ 1)",
  },
  {
    date: "1 ตุลาคม พ.ศ. 2558",
    title: "การแปรสภาพเป็นมณฑลทหารบกที่ 16",
    description:
      "จังหวัดทหารบกราชบุรี ได้ แปรสภาพเป็นมณฑลทหารบกที่ 16\n\nนามหน่วยเปลี่ยนจาก จังหวัดทหารบกราชบุรี → มณฑลทหารบกที่ 16\n\nพื้นที่รับผิดชอบ 3 จังหวัด ได้แก่\n- จังหวัดราชบุรี\n- จังหวัดสมุทรสงคราม\n- จังหวัดสมุทรสาคร",
  },
];

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 50,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

export default function HistoryTimeline({
  title,
  items = defaultTimelineItems,
}: HistoryTimelineProps) {
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Initialize refs array
  useEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, items.length);
  }, [items.length]);

  // Calculate line height based on visible items
  const getLineHeight = () => {
    if (visibleItems.size === 0) return 0;

    const maxVisibleIndex = Math.max(...Array.from(visibleItems));
    const lastVisibleItem = itemRefs.current[maxVisibleIndex];

    if (!lastVisibleItem || !containerRef.current) return 0;

    const containerRect = containerRef.current.getBoundingClientRect();
    const itemRect = lastVisibleItem.getBoundingClientRect();

    // Calculate distance from container top to center of the last visible item
    const distance = itemRect.top + itemRect.height / 2 - containerRect.top;
    return Math.max(0, distance);
  };

  return (
    <div ref={containerRef} className="relative">
      {title && (
        <h3 className="text-xl md:text-2xl font-semibold text-center mb-8 text-primary">
          {title}
        </h3>
      )}

      {/* Animated timeline line */}
      <motion.div
        className="absolute left-4 md:left-8 top-0 w-0.5 bg-muted-foreground origin-top"
        initial={{ height: 0 }}
        animate={{ height: getLineHeight() }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
      />

      <div className="space-y-8 md:space-y-12">
        {items.map((item: TimelineItem, index: number) => {
          const itemRef = useRef<HTMLDivElement>(null);
          const isItemInView = useInView(itemRef, {
            once: true,
            margin: "-50px",
            amount: 0.3,
          });

          // Update visible items when this item comes into view
          useEffect(() => {
            if (isItemInView) {
              setVisibleItems((prev) => new Set([...prev, index]));
            }
          }, [isItemInView, index]);

          return (
            <motion.div
              key={index}
              ref={(el) => {
                itemRef.current = el;
                itemRefs.current[index] = el;
              }}
              className="relative flex items-start group"
              initial="hidden"
              animate={isItemInView ? "visible" : "hidden"}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              transition={{
                duration: 0.8,
                ease: [0.4, 0, 0.2, 1],
                delay: isItemInView ? 0.2 : 0,
              }}
            >
              <motion.div
                className="flex-shrink-0 w-6 h-6 md:w-12 md:h-12 ml-1 md:ml-2 bg-accent rounded-full flex items-center justify-center text-accent-foreground font-bold text-xs md:text-sm"
                initial={{ scale: 0 }}
                animate={isItemInView ? { scale: 1 } : { scale: 0 }}
                transition={{
                  duration: 0.5,
                  ease: [0.4, 0, 0.2, 1],
                  delay: isItemInView ? 0.4 : 0,
                }}
              >
                {index + 1}
              </motion.div>
              <div className="ml-4 md:ml-8 flex-1">
                <motion.h3
                  className="text-sm md:text-lg font-semibold text-primary mb-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={
                    isItemInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }
                  }
                  transition={{
                    duration: 0.6,
                    ease: [0.4, 0, 0.2, 1],
                    delay: isItemInView ? 0.3 : 0,
                  }}
                >
                  {item.date}
                </motion.h3>
                <motion.h4
                  className="text-base md:text-xl font-medium mb-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={
                    isItemInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }
                  }
                  transition={{
                    duration: 0.6,
                    ease: [0.4, 0, 0.2, 1],
                    delay: isItemInView ? 0.4 : 0,
                  }}
                >
                  {item.title}
                </motion.h4>
                <motion.p
                  className="text-muted-foreground text-sm md:text-base leading-relaxed whitespace-pre-line"
                  initial={{ opacity: 0, x: -20 }}
                  animate={
                    isItemInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }
                  }
                  transition={{
                    duration: 0.6,
                    ease: [0.4, 0, 0.2, 1],
                    delay: isItemInView ? 0.5 : 0,
                  }}
                >
                  {item.description}
                </motion.p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
