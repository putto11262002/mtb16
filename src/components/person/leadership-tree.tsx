import { Button } from "@/components/ui/button";
import type { Person } from "@/db/schema";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLayoutEffect, useRef, useState } from "react";
import { PersonCard } from "./person-card";

type PersonWithUnit = Person;

interface LeadershipTreeProps {
  levels: PersonWithUnit[][];
}

const LevelComponent = ({ level }: { level: PersonWithUnit[] }) => {
  const [translateX, setTranslateX] = useState(0);
  const [maxOffset, setMaxOffset] = useState(0);
  const [step, setStep] = useState(200);
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const updateDimensions = () => {
      const container = containerRef.current;
      if (container) {
        const contentWidth = container.scrollWidth;
        const clientWidth = container.getBoundingClientRect().width;
        setMaxOffset(Math.max(0, contentWidth - clientWidth));
        const cardWidth = container.children[0]?.clientWidth || 160;
        setStep(cardWidth + 16);
      }
    };

    updateDimensions();

    const handleResize = () => updateDimensions();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [level]);

  const handleSlide = (direction: number) => {
    setTranslateX((prev) =>
      direction > 0
        ? Math.min(prev + step, maxOffset)
        : Math.max(prev - step, -maxOffset),
    );
  };

  const canScrollLeft = maxOffset > 0;
  const canScrollRight = maxOffset > 0;

  return (
    <div className="relative overflow-hidden">
      <Button
        variant="outline"
        size="icon"
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 transition-opacity"
        style={{ opacity: canScrollLeft ? 1 : 0 }}
        onClick={() => handleSlide(1)}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <div className="overflow-hidden px-4">
        <div
          ref={containerRef}
          className="w-auto"
          style={{
            transform: `translateX(${translateX}px)`,
            transition: "transform 0.3s ease",
          }}
        >
          <div className="flex items-center justify-center space-x-4 w-auto">
            {level.map((person) => (
              <div key={person.id}>
                <PersonCard person={person} />
              </div>
            ))}
          </div>
        </div>
      </div>
      <Button
        variant="outline"
        size="icon"
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 transition-opacity"
        style={{ opacity: canScrollRight ? 1 : 0 }}
        onClick={() => handleSlide(-1)}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default function LeadershipTree({ levels }: LeadershipTreeProps) {
  return (
    <div className="space-y-6 overflow-x-auto">
      {levels.map((level, levelIndex) =>
        level.length === 0 ? null : (
          <LevelComponent key={levelIndex} level={level} />
        ),
      )}
    </div>
  );
}
