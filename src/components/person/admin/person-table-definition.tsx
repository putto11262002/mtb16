import { Button } from "@/components/ui/button";
import type { Person } from "@/db/schema";
import type { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash } from "lucide-react";
import { usePersonAction } from "./person-action-context";

export const personColumns: ColumnDef<Person>[] = [
  {
    accessorKey: "name",
    header: "ชื่อ",
  },
  {
    accessorKey: "rank",
    header: "ยศ",
    cell: ({ row }) => <span>{row.original.rank || "-"}</span>,
  },
  {
    accessorKey: "role",
    header: "ตำแหน่ง",
    cell: ({ row }) => <span>{row.original.role || "-"}</span>,
  },
  {
    accessorKey: "level",
    header: "ระดับ",
    cell: ({ row }) => <span>{row.original.level ?? "-"}</span>,
  },

  {
    id: "actions",
    header: () => <span className="sr-only">การจัดการ</span>,
    cell: ({ row }) => {
      const { setPersonAction, personAction } = usePersonAction();
      return (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              if (personAction) return;
              setPersonAction({ type: "update", id: row.original.id });
            }}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              if (personAction) return;
              setPersonAction({ type: "delete", id: row.original.id });
            }}
          >
            <Trash className="w-4 h-4" />
          </Button>
        </div>
      );
    },
  },
];
