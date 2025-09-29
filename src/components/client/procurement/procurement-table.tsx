import { Config } from "@/config";
import type { Procurement } from "@/db/schema";
import { truncate } from "@/lib/utils/string";
import { type ColumnDef } from "@tanstack/react-table";
import { Download } from "lucide-react";

export const columns: ColumnDef<Procurement>[] = [
  {
    accessorKey: "title",
    header: "หัวข้อ",
    cell: ({ row }) => (
      <div>{truncate(row.getValue("title") as string, 50)}</div>
    ),
  },
  {
    accessorKey: "annualPlan",
    header: "แผนการจัดซื้อจัดจ้าง",
    cell: ({ row }) => {
      const annualPlan = row.getValue("annualPlan") as any[];
      if (!annualPlan || annualPlan.length === 0) return <div>-</div>;
      return (
        <a
          href={Config.getFileURL(annualPlan[0].id)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center"
        >
          <Download className="h-4 w-4" />
        </a>
      );
    },
  },
  {
    accessorKey: "invitation",
    header: "ประกาศเชิญชวน",
    cell: ({ row }) => {
      const invitation = row.getValue("invitation") as any[];
      if (!invitation || invitation.length === 0) return <div>-</div>;
      return (
        <a
          href={Config.getFileURL(invitation[0].id)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center"
        >
          <Download className="h-4 w-4" />
        </a>
      );
    },
  },
  {
    accessorKey: "priceDisclosure",
    header: "เอกสารประกวดราคา/สอบราคา",
    cell: ({ row }) => {
      const priceDisclosure = row.getValue("priceDisclosure") as any[];
      if (!priceDisclosure || priceDisclosure.length === 0) return <div>-</div>;
      return (
        <a
          href={Config.getFileURL(priceDisclosure[0].id)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center"
        >
          <Download className="h-4 w-4" />
        </a>
      );
    },
  },
  {
    accessorKey: "winnerDeclaration",
    header: "ประกาศผู้ชนะ",
    cell: ({ row }) => {
      const winnerDeclaration = row.getValue("winnerDeclaration") as any[];
      if (!winnerDeclaration || winnerDeclaration.length === 0)
        return <div>-</div>;
      return (
        <a
          href={Config.getFileURL(winnerDeclaration[0].id)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center"
        >
          <Download className="h-4 w-4" />
        </a>
      );
    },
  },
  {
    accessorKey: "details",
    header: "รายละเอียด",
    cell: ({ row }) => {
      const details = row.getValue("details") as string;
      return <div>{truncate(details || "-", 100)}</div>;
    },
  },
];
