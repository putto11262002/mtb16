import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";

const missionPoints = [
  "บังคับบัญชากำลังประจำถิ่นของกองทัพบก ตามที่กระทรวงกลาโหมกำหนด",
  "รักษาความสงบเรียบร้อยในพื้นที่ รวมทั้งการศาลทหาร การคดี การช่วยดำเนินการคุ้มครองพยานในคดีอาญาและการเรือนจำ",
  "ดำเนินการสัสดี การเกณฑ์ช่วยราชการทหาร และการระดมสรรพกำลังในเขตพื้นที่",
  "สนับสนุนหน่วยทหารที่อยู่ในเขตพื้นที่",
  "ดำเนินการตามแผนยุทธศาสตร์การต่อสู้เบ็ดเสร็จเพื่อรักษาความสงบภายใน และการป้องกันประเทศ",
];

export default function HeroSection() {
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
  const unitNameY = useTransform(smoothProgress, [0, 0.3], ["0vh", "-50vh"]);

  // Slogan section stays fixed until all words appear, then moves up
  const sloganSectionY = useTransform(
    smoothProgress,
    [0.2, 0.5, 0.6],
    ["0vh", "0vh", "-30vh"],
  );

  // Slogan section visibility - appears when scrolled into view
  const sloganSectionOpacity = useTransform(
    smoothProgress,
    [0.2, 0.22, 0.4],
    [0, 1, 1],
  );

  // Mission section transforms - appears after slogan words finish animating
  const missionOpacity = useTransform(
    smoothProgress,
    [0.6, 0.7, 0.8],
    [0, 0, 1],
  );
  const missionY = useTransform(smoothProgress, [0.6, 0.8], ["50vh", "0vh"]);

  // Progress indicator
  const progressWidth = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

  return (
    <section ref={containerRef} className="relative h-[350vh]">
      {/* Progress bar */}

      {/* First screen: Unit Name */}
      <div className="relative h-screen overflow-hidden bg-gradient-to-br from-primary via-background to-secondary/20">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src={"/about-background1.jpg"}
            alt="Military background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/70 mix-blend-multiply" />
        </div>

        <div className="relative z-10 h-full flex items-center justify-center px-4">
          <motion.div
            className="text-center"
            style={{
              opacity: unitNameOpacity,
              y: unitNameY,
            }}
          >
            <motion.h1
              className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1 }}
            >
              มณฑลทหารบกที่ 16
            </motion.h1>
            <motion.p
              className="text-xl md:text-2xl text-white/90 font-medium"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              16th Infantry Division
            </motion.p>
            <motion.p
              className="text-lg md:text-xl text-white/80 mt-4 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              กองทัพภาคที่ 3 - พระนครศรีอยุธยา
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* Second screen: Slogan Animation */}
      <div className="relative h-screen overflow-hidden bg-gradient-to-br from-secondary/10 via-background to-accent/10">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="/assets/logo.png"
            alt="Division logo background"
            className="w-full h-full object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/70 via-secondary/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 h-full flex items-center justify-center px-4">
          <motion.div
            className="text-center"
            style={{
              y: sloganSectionY,
            }}
          >
            <div className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 flex flex-col md:flex-row gap-4 md:gap-8 justify-center items-center">
              <motion.div
                className="text-primary"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0 }}
                viewport={{ amount: 0.3 }}
              >
                <motion.span
                  animate={{
                    textShadow: [
                      "0 0 20px rgba(255, 255, 255, 0.5)",
                      "0 0 40px rgba(255, 255, 255, 0.8)",
                      "0 0 20px rgba(255, 255, 255, 0.5)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  แม่นยำ
                </motion.span>
              </motion.div>

              <motion.div
                className="text-primary"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ amount: 0.3 }}
              >
                <motion.span
                  animate={{
                    textShadow: [
                      "0 0 20px rgba(255, 255, 255, 0.5)",
                      "0 0 40px rgba(255, 255, 255, 0.8)",
                      "0 0 20px rgba(255, 255, 255, 0.5)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  กระชับ
                </motion.span>
              </motion.div>

              <motion.div
                className="text-primary"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                viewport={{ amount: 0.3 }}
              >
                <motion.span
                  animate={{
                    textShadow: [
                      "0 0 20px rgba(255, 255, 255, 0.5)",
                      "0 0 40px rgba(255, 255, 255, 0.8)",
                      "0 0 20px rgba(255, 255, 255, 0.5)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ฉับไว
                </motion.span>
              </motion.div>
            </div>

            <motion.p
              className="text-xl md:text-2xl text-white/90 font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Accurate • Concise • Swiftly
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* Third screen: Mission Points with Stagger Animation */}
      <div className="relative h-screen overflow-hidden bg-gradient-to-br from-background via-primary/5 to-background">
        <div className="relative z-10 h-full flex items-center justify-center px-4">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            style={{
              opacity: missionOpacity,
              y: missionY,
            }}
          >
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-foreground mb-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ amount: 0.3 }}
            >
              ภารกิจของเรา
            </motion.h2>

            <motion.div
              className="space-y-4"
              initial="hidden"
              whileInView="visible"
              viewport={{ amount: 0.2 }}
              transition={{ staggerChildren: 0.3 }}
            >
              {missionPoints.map((point, index) => (
                <motion.div
                  key={index}
                  className="flex items-start gap-4 py-3 px-6 bg-card/50 backdrop-blur-sm rounded-lg border border-border/50"
                  variants={{
                    hidden: { opacity: 0, x: -50 },
                    visible: {
                      opacity: 1,
                      x: 0,
                      transition: { duration: 0.8 },
                    },
                  }}
                >
                  <span className="text-primary font-semibold text-lg min-w-[24px] mt-1">
                    {index + 1}.
                  </span>
                  <p className="text-base leading-relaxed text-left flex-1">
                    {point}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
