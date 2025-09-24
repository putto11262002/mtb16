import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

/**
 * Skeleton that mirrors AnnouncementTableDefinition
 * Columns: title | published (badge) | attachments (badge with icon) | actions (4 icon buttons)
 */
export function AnnouncementTableSkeleton({
  rows = 6,
  className,
}: {
  rows?: number;
  className?: string;
}) {
  return (
    <div className={cn("w-full overflow-x-auto", className)}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[240px] w-[45%]">หัวข้อ</TableHead>
            <TableHead className="min-w-[120px] w-[15%]">สถานะ</TableHead>
            <TableHead className="min-w-[140px] w-[15%]">ไฟล์แนบ</TableHead>
            <TableHead className="min-w-[200px] w-[25%] text-right">
              การจัดการ
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, i) => (
            <TableRow key={i}>
              {/* title */}
              <TableCell className="w-[45%]">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[70%]" />
                  <Skeleton className="h-4 w-[45%]" />
                </div>
              </TableCell>

              {/* published badge */}
              <TableCell className="w-[15%]">
                <div className="inline-flex items-center rounded-md border px-2 py-1">
                  <Skeleton className="h-3 w-16" />
                </div>
              </TableCell>

              {/* attachments badge with paperclip space */}
              <TableCell className="w-[15%]">
                <div className="inline-flex items-center gap-2 rounded-md border px-2 py-1">
                  {/* icon circle placeholder */}
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-3 w-6" />
                </div>
              </TableCell>

              {/* actions: 4 icon buttons aligned right */}
              <TableCell className="w-[25%]">
                <div className="flex items-center justify-end gap-2">
                  <IconButtonSkeleton />
                  <IconButtonSkeleton />
                  <IconButtonSkeleton />
                  <IconButtonSkeleton />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function IconButtonSkeleton() {
  return (
    <div className="inline-flex h-9 w-9 items-center justify-center rounded-md">
      <Skeleton className="h-4 w-4 rounded-[4px]" />
    </div>
  );
}
