import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { News } from "@/core/news/schema";
import type { ColumnDef } from "@tanstack/react-table";
import { Edit, Eye, EyeOff, Paperclip, Trash } from "lucide-react";
import { useNewsAction } from "./news-action-context";

export const newsColumns: ColumnDef<News>[] = [
  {
    accessorKey: "title",
    header: "หัวข้อ",
  },
  {
    accessorKey: "published",
    header: "สถานะ",
    cell: ({ row }) => (
      <Badge variant={row.original.publishedAt ? "default" : "outline"}>
        {row.original.publishedAt ? "เผยแพร่แล้ว" : "ร่าง"}
      </Badge>
    ),
  },
  {
    id: "attachments",
    header: "รูปภาพเพิ่มเติม",
    cell: ({ row }) => {
      const numAttachments = row.original.attachments?.length || 0;

      return (
        <Badge variant="outline">
          <Paperclip className="inline mr-2 w-3 h-3" />
          {numAttachments}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: () => <span className="sr-only">การจัดการ</span>,
    cell: ({ row }) => {
      const { setNewsAction, newsAction } = useNewsAction();
      return (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              if (newsAction) return;
              setNewsAction({ type: "update", id: row.original.id });
            }}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              if (newsAction) return;
              setNewsAction({ type: "delete", id: row.original.id });
            }}
          >
            <Trash className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              if (newsAction) return;
              setNewsAction(
                row.original.publishedAt
                  ? { type: "unpublish", id: row.original.id }
                  : { type: "publish", id: row.original.id },
              );
            }}
          >
            {row.original.publishedAt ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </Button>
        </div>
      );
    },
  },
];
