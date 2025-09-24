import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Announcement } from "@/core/announcement/schema";
import type { ColumnDef } from "@tanstack/react-table";
import { Edit, Eye, EyeOff, Paperclip, Trash } from "lucide-react";
import { useAnnouncementAction } from "./announcement-action-context";

export const announcementColumns: ColumnDef<Announcement>[] = [
  {
    accessorKey: "title",
    header: "หัวข้อ",
  },
  {
    accessorKey: "tags",
    header: "แท็ก",
    cell: ({ row }) => (
      <div className="flex gap-1">
        {row.original.tags && row.original.tags.length > 0 ? (
          row.original.tags?.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))
        ) : (
          <span className="text-muted-foreground">ไม่มี</span>
        )}
      </div>
    ),
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
    header: "ไฟล์แนบ",
    cell: ({ row }) => {
      const numAttachments = row.original.attachments?.length || 0;

      return (
        <Badge variant="outline">
          <Paperclip className="inline mr-2" />
          {numAttachments}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: () => <span className="sr-only">การจัดการ</span>,
    cell: ({ row }) => {
      const { setAnnouncementAction, announcementAction } =
        useAnnouncementAction();
      return (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              if (announcementAction) return;
              setAnnouncementAction({ type: "update", id: row.original.id });
            }}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              if (announcementAction) return;
              setAnnouncementAction({ type: "delete", id: row.original.id });
            }}
          >
            <Trash className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              if (announcementAction) return;
              setAnnouncementAction(
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
