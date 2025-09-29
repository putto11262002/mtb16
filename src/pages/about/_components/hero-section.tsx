import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";

interface Props {
  bg1Src: string;
  heroImage?: string;
}

export default function HeroSection({ bg1Src, heroImage }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Smooth scroll progress for more fluid animations
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
  });

  // Unit name transforms - starts visible, fades out as scroll progresses
  const unitNameOpacity = useTransform(
    smoothProgress,
    [0, 0.15, 0.3],
    [1, 1, 0],
  );

  return (
    <section ref={containerRef} className="relative">
      {/* Progress bar */}

      {/* First screen: Unit Name */}
      <div className="relative h-screen overflow-hidden bg-gradient-to-br from-primary via-background to-secondary/20">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src={heroImage || bg1Src}
            alt="Military background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/70 z-10" />
        </div>

        <div className="relative z-10 h-full flex items-center justify-center px-4">
          <motion.div className="text-center">
            <motion.h1
              className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              มณฑลทหารบกที่ 16
            </motion.h1>
            <motion.p
              className="text-xl md:text-2xl text-white/90 font-medium"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              viewport={{ once: true }}
            >
              16th Military Circle
            </motion.p>
            <motion.p
              className="text-lg md:text-xl text-white/80 mt-4 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              viewport={{ once: true }}
            >
              เพื่อชาติ ศาสน์ กษัตริย์ และประชาชน
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
