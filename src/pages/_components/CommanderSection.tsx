import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Person } from "@/db/schema";

interface CommanderSectionProps {
  person: Person;
}

export function CommanderSection({ person }: CommanderSectionProps) {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">พบกับผู้นำของเรา</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            ผู้เชี่ยวชาญที่อุทิศตนนำหน่วยของเราด้วยความเป็นเลิศและความมุ่งมั่น
          </p>
        </div>

        <div className="flex justify-center">
          <Card className="max-w-md hover:shadow-xl transition-all duration-300 group">
            <CardHeader className="text-center pb-6">
              <div className="relative mx-auto mb-6">
                {person.portrait ? (
                  <img
                    src={person.portrait}
                    alt={person.name}
                    className="w-32 h-32 object-cover border-4 border-primary/10 group-hover:border-primary/30 transition-colors"
                  />
                ) : (
                  <div className="w-32 h-32 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border-4 border-primary/10 group-hover:border-primary/30 transition-colors">
                    <span className="text-3xl font-bold text-primary">
                      {person.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                )}
              </div>

              <CardTitle className="text-2xl mb-2">{person.name}</CardTitle>

              <CardDescription className="text-lg font-medium text-primary">
                {person.role}
              </CardDescription>
            </CardHeader>

            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">
                {person.bio ||
                  "นำหน่วยของเราด้วยความอุทิศและวิสัยทัศน์เชิงกลยุทธ์"}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
