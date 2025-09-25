import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { DirectoryEntry } from "@/db/schema";
import type { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash } from "lucide-react";
import { useDirectoryAction } from "./directory-action-context";

export const directoryColumns: ColumnDef<DirectoryEntry>[] = [
  {
    accessorKey: "name",
    header: "ชื่อ",
  },
  {
    accessorKey: "tag",
    header: "แท็ก",
    cell: ({ row }) => (
      <div className="flex gap-1">
        {row.original.tag ? (
          <Badge variant="secondary">{row.original.tag}</Badge>
        ) : (
          <span className="text-muted-foreground">ไม่มี</span>
        )}
      </div>
    ),
  },
  {
    id: "actions",
    header: () => <span className="sr-only">การจัดการ</span>,
    cell: ({ row }) => {
      const { setDirectoryAction, directoryAction } = useDirectoryAction();
      return (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              if (directoryAction) return;
              setDirectoryAction({ type: "update", id: row.original.id });
            }}
          >
            <Edit className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              if (directoryAction) return;
              setDirectoryAction({ type: "delete", id: row.original.id });
            }}
          >
            <Trash className="w-4 h-4" />
          </Button>
        </div>
      );
    },
  },
];
