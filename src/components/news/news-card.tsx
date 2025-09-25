import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Card, CardFooter } from "@/components/ui/card";
import { Config } from "@/config";
import type { News } from "@/core/news/schema";
import { formatDate } from "@/lib/utils/date";

interface NewsCardProps {
  news: News;
}

export function NewsCard({ news }: NewsCardProps) {
  return (
    <Card className="overflow-hidden p-0 gap-0">
      {/* Preview Image */}
      <AspectRatio ratio={16 / 9}>
        {news.previewImage ? (
          <img
            src={Config.getFileURL(news.previewImage.id)}
            alt={news.title}
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
            {news.title}
          </h3>
          {news.publishedAt && (
            <p className="text-sm text-muted-foreground">
              เผยแพร่เมื่อ {formatDate(news.publishedAt)}
            </p>
          )}
        </div>

        <Button
          variant="link"
          className="w-auto p-0 h-auto text-sm text-secondary-foreground hover:underline self-start"
          asChild
        >
          <a href={`/news/${news.id}`}>ดูรายละเอียด →</a>
        </Button>
      </CardFooter>
    </Card>
  );
}
