import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ProcurementItem } from "@/core/procurement/schema";
import { formatDate } from "@/lib/utils/date";
import type { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash } from "lucide-react";
import { useProcurementAction } from "./procurement-action-context";

export const procurementColumns: ColumnDef<ProcurementItem>[] = [
  {
    accessorKey: "title",
    header: "หัวข้อ",
  },
  {
    accessorKey: "status",
    header: "สถานะ",
    cell: ({ row }) => (
      <Badge variant={row.original.status === "open" ? "default" : "secondary"}>
        {row.original.status === "open" ? "เปิดรับ" : "ปิดแล้ว"}
      </Badge>
    ),
  },
  {
    accessorKey: "date",
    header: "วันที่",
    cell: ({ row }) => formatDate(row.original.date),
  },
  {
    accessorKey: "year",
    header: "ปี",
  },
  {
    id: "actions",
    header: () => <span className="sr-only">การจัดการ</span>,
    cell: ({ row }) => {
      const { setProcurementAction, procurementAction } =
        useProcurementAction();
      return (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              if (procurementAction) return;
              setProcurementAction({ type: "update", id: row.original.id });
            }}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              if (procurementAction) return;
              setProcurementAction({ type: "delete", id: row.original.id });
            }}
          >
            <Trash className="w-4 h-4" />
          </Button>
        </div>
      );
    },
  },
];
