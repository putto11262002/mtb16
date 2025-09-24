import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Card, CardFooter } from "@/components/ui/card";
import { Config } from "@/config";
import type { Announcement } from "@/core/announcement/schema";
import { formatDate } from "@/lib/utils/date";

interface AnnouncementCardProps {
  announcement: Announcement;
}

export function AnnouncementCard({ announcement }: AnnouncementCardProps) {
  return (
    <Card className="overflow-hidden p-0 gap-0">
      {/* Preview Image */}
      <AspectRatio ratio={16 / 9}>
        {announcement.previewImage ? (
          <img
            src={Config.getFileURL(announcement.previewImage.id)}
            alt={announcement.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <div className="text-muted-foreground text-sm">ไม่มีรูปภาพ</div>
          </div>
        )}
      </AspectRatio>

      {/* Footer */}
      <CardFooter className="flex flex-col items-start gap-3 p-4">
        <div className="w-full">
          <h3 className="font-semibold text-lg line-clamp-2 mb-1">
            {announcement.title}
          </h3>
          {announcement.publishedAt && (
            <p className="text-sm text-muted-foreground">
              เผยแพร่เมื่อ {formatDate(announcement.publishedAt)}
            </p>
          )}
        </div>

        <Button
          variant="link"
          className="w-auto p-0 h-auto text-sm text-secondary-foreground hover:underline self-start"
          asChild
        >
          <a href={`/announcements/${announcement.id}`}>ดูรายละเอียด →</a>
        </Button>
      </CardFooter>
    </Card>
  );
}
