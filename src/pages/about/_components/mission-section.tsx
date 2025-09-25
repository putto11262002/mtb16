import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";

const missionPoints = [
  "บังคับบัญชากำลังประจำถิ่นของกองทัพบก ตามที่กระทรวงกลาโหมกำหนด",
  "รักษาความสงบเรียบร้อยในพื้นที่ รวมทั้งการศาลทหาร การคดี การช่วยดำเนินการคุ้มครองพยานในคดีอาญาและการเรือนจำ",
  "ดำเนินการสัสดี การเกณฑ์ช่วยราชการทหาร และการระดมสรรพกำลังในเขตพื้นที่",
  "สนับสนุนหน่วยทหารที่อยู่ในเขตพื้นที่",
  "ดำเนินการตามแผนยุทธศาสตร์การต่อสู้เบ็ดเสร็จเพื่อรักษาความสงบภายใน และการป้องกันประเทศ",
];

export default function MissionSection() {
  return (
    <section className="py-16 px-4 bg-gradient-to-br from-background via-primary/5 to-background">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ amount: 0.3, once: true }}
        >
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-foreground mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ amount: 0.3, once: true }}
          >
            ภารกิจของเรา
          </motion.h2>

          <motion.div
            className="space-y-3 max-w-2xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ amount: 0.2, once: true }}
            transition={{ staggerChildren: 0.3 }}
          >
            {missionPoints.map((point, index) => (
              <motion.div
                key={index}
                className="relative"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.8 },
                  },
                }}
              >
                {/* Content */}
                <div className="pb-4 flex px-2">
                  <div className="flex items-start space-x-4 max-w-2xl">
                    <div className="w-6 h-6 bg-accent text-foreground rounded-full flex items-center justify-center text-xs flex-shrink-0">
                      {index + 1}
                    </div>
                    <p className="leading-relaxed text-left text-sm">{point}</p>
                  </div>
                </div>

                {/* Visual divider (except for last item) */}

                {index < missionPoints.length - 1 && <Separator />}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
