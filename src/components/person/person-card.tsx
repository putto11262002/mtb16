import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Person } from "@/db/schema";

interface PersonCardProps {
  person: Person;
  showBio?: boolean;
  showButton?: boolean;
}

export function PersonCard({
  person,
  showBio = false,
  showButton = false,
}: PersonCardProps) {
  return (
    <Card
      className={`flex-shrink-0 ${showBio ? "max-w-md hover:shadow-xl transition-all duration-300 group" : "w-32 sm:w-44 md:w-52 lg:w-60 shadow-lg hover:shadow-xl transition-shadow duration-300"}`}
    >
      <CardContent className={showBio ? "text-center pb-6" : ""}>
        <div
          className={`flex flex-col items-center text-center ${showBio ? "" : "mt-4"}`}
        >
          {showBio ? (
            <div className="relative mx-auto mb-6">
              {person.portrait ? (
                <img
                  src={person.portrait}
                  alt={person.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-primary/10 group-hover:border-primary/30 transition-colors"
                />
              ) : (
                <div className="w-32 h-32 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full flex items-center justify-center border-4 border-primary/10 group-hover:border-primary/30 transition-colors">
                  <span className="text-3xl font-bold text-primary">
                    {person.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full aspect-square bg-muted rounded overflow-hidden">
              {person.portrait && (
                <img
                  src={person.portrait}
                  alt={person.name}
                  className="object-cover w-full h-full"
                />
              )}
            </div>
          )}
          <div className={showBio ? "" : "mt-4"}>
            {!showBio && person.rank && (
              <Badge variant="outline" className="mb-2">
                {person.rank}
              </Badge>
            )}
            <h3
              className={`font-semibold mb-2 ${showBio ? "text-2xl" : "text-xs sm:text-sm"}`}
            >
              {person.name}
            </h3>
            <p
              className={`mb-2 text-muted-foreground ${showBio ? "text-lg font-medium text-primary" : "text-xs sm:text-sm"}`}
            >
              {person.role}
            </p>
            {showBio && person.bio && (
              <p className="text-muted-foreground mb-4">
                {person.bio ||
                  "นำหน่วยของเราด้วยความอุทิศและวิสัยทัศน์เชิงกลยุทธ์"}
              </p>
            )}
            {showButton && (
              <Button
                variant="outline"
                className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
              >
                เรียนรู้เพิ่มเติม
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
