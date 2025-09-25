interface TimelineItem {
  date: string;
  title: string;
  description: string;
}

interface HistoryTimelineProps {
  items: TimelineItem[];
}

export default function HistoryTimeline({ items }: HistoryTimelineProps) {
  return (
    <div className="relative">
      {/* Static timeline line */}
      <div className="absolute left-4 md:left-8 top-3 md:top-6 bottom-3 md:bottom-6 w-px bg-muted-foreground/40" />

      <div className="space-y-8 md:space-y-12">
        {items.map((item: TimelineItem, index: number) => (
          <div key={index} className="relative flex items-start group">
            <div className="flex-shrink-0 w-6 h-6 md:w-8 md:h-8 ml-1 md:ml-4 bg-accent rounded-full flex items-center justify-center text-accent-foreground font-bold text-xs md:text-sm">
              {index + 1}
            </div>
            <div className="ml-4 md:ml-8 flex-1">
              <h3 className="text-sm md:text-base font-semibold text-muted-foreground mb-2">
                {item.date}
              </h3>
              <h4 className="text-base md:text-xl font-medium mb-3">
                {item.title}
              </h4>
              <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
