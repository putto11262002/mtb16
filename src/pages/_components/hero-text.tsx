import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface HeroTextProps {
  heroTitle?: string;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

export default function HeroText() {
  return (
    <motion.div
      className="relative container mx-auto text-center z-20"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="inline-flex items-center rounded-full border px-3 py-1 text-sm bg-white/10 backdrop-blur-sm border-white/20"
        variants={itemVariants}
      >
        <span className="text-white/90">เว็บไซต์ทางการของ</span>
      </motion.div>
      <motion.h1
        className="mt-12 text-4xl sm:text-5xl md:text-7xl font-bold text-accent drop-shadow-lg"
        variants={itemVariants}
      >
        {"มณฑลทหารบกที่ ๑๖"}
      </motion.h1>
      <motion.p
        className="mt-8 sm:text-3xl text-lg text-white max-w-2xl mx-auto leading-relaxed drop-shadow-sm px-4"
        variants={itemVariants}
      >
        เพื่อชาติ ศาสน์ กษัตริย์ และประชาชน
      </motion.p>
      <motion.p
        className="mt-2 text-sm sm:text-base text-white/80 max-w-2xl mx-auto leading-relaxed drop-shadow-sm px-4"
        variants={itemVariants}
      >
        For the Nation, Religion, Monarchy, and People
      </motion.p>
      {/* Mobile Links */}
      <motion.div
        className="flex flex-col gap-6 justify-center mt-12 md:hidden"
        variants={itemVariants}
      >
        <div className="flex flex-col gap-6 text-center">
          <a
            href="/news"
            className="hover:text-primary/80 transition-colors text-xl font-semibold underline decoration-2 underline-offset-4 hover:decoration-primary/80 block"
          >
            → อ่านข่าวล่าสุด
          </a>
          <a
            href="/announcements"
            className="text-white/80 hover:text-primary transition-colors text-lg font-medium underline decoration-2 underline-offset-4 hover:decoration-primary block"
          >
            <span className="mr-2">→</span>ดูประกาศทั้งหมด
          </a>
        </div>
      </motion.div>
      {/* Desktop Buttons */}
      <motion.div
        className="hidden md:flex flex-col sm:flex-row gap-4 justify-center mt-12"
        variants={itemVariants}
      >
        <Button size="sm" className="px-8 bg-accent  hover:bg-accent/90">
          <a href="/news">ข่าวล่าสุด</a>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="px-8 hover:bg-background/90"
        >
          <a href="/announcements">ดูประกาศ</a>
        </Button>
      </motion.div>
    </motion.div>
  );
}
