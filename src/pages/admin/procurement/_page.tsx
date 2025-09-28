import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";

import { ActionConfirmDialog } from "@/components/common/action-confirm-dialog";
import { Loader } from "@/components/common/loader";
import { CreateProcurementSheetContent } from "@/components/procurement/admin/create-procurement-sheet-content";
import { EditProcurementSheetContent } from "@/components/procurement/admin/edit-procurement-sheet-content";
import {
  isCreateProcurementAction,
  isDeleteProcurementAction,
  isUpdateProcurementAction,
  ProcurementActionProvider,
  useProcurementAction,
} from "@/components/procurement/admin/procurement-action-context";
import { procurementColumns } from "@/components/procurement/admin/procurement-table-definition";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { DataTable } from "@/components/ui/data-table";
import { useDeleteProcurement } from "@/hooks/procurement/mutations";
import { useGetProcurements } from "@/hooks/procurement/queries";
import { useAddToasts } from "@/hooks/react-query";
import { usePagination } from "@/hooks/use-pagination";
import { CircleX, Plus } from "lucide-react";
import { PaginationNav } from "../_components/pagination-nav";
import { useProcurementFilters } from "./_hooks";

function AdminProcurementPageContent() {
  const { procurementAction, setProcurementAction } = useProcurementAction();

  const { mutate: deleteProcurement, isPending: isDeleting } = useAddToasts(
    useDeleteProcurement,
    {
      successMessage: "ลบประกาศจัดซื้อ/จัดจ้างเรียบร้อย",
      errorMessage: "เกิดข้อผิดพลาดในการลบประกาศจัดซื้อ/จัดจ้าง",
    },
  );

  const filters = useProcurementFilters();

  const { page, nextPage, prevPage } = usePagination();

  const { data, isLoading, error } = useGetProcurements({
    page,
    q: filters.debouncedQ,
    status: filters.status,
    orderBy: "createdAt",
    direction: "desc",
    pageSize: 20,
  });
  console.log({ status: filters.status });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 flex-1">
        <Input
          placeholder="ค้นหาประกาศจัดซื้อ/จัดจ้าง..."
          className="flex-1 sm:max-w-xs"
          value={filters.q}
          onChange={(e) => filters.setQ(e.target.value)}
        />
        <Select
          value={filters.status || "all"}
          onValueChange={(value) => {
            filters.setStatus(
              value === "all" ? undefined : (value as "open" | "closed"),
            );
          }}
        >
          <SelectTrigger className="flex-1 w-full sm:max-w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">ทั้งหมด</SelectItem>
            <SelectItem value="open">เปิดรับ</SelectItem>
            <SelectItem value="closed">ปิดแล้ว</SelectItem>
          </SelectContent>
        </Select>
        <Sheet
          onOpenChange={(open) =>
            setProcurementAction(open ? { type: "create" } : null)
          }
          open={isCreateProcurementAction(procurementAction)}
        >
          <SheetTrigger asChild className="sm:ml-auto flex-1 sm:flex-none">
            <Button className="">
              <Plus className="mr-2 h-4 w-4" />
              <span>สร้างประกาศใหม่</span>
            </Button>
          </SheetTrigger>
          <CreateProcurementSheetContent
            onClose={() =>
              isCreateProcurementAction(procurementAction) &&
              setProcurementAction(null)
            }
          />
        </Sheet>
      </div>
      {/* Table */}
      <div className="rounded-md border w-full overflow-hidden min-w-0">
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Alert variant="destructive">
            <CircleX className="h-4 w-4 text-destructive" />
            <AlertTitle>
              เกิดข้อผิดพลาดในการโหลดประกาศจัดซื้อ/จัดจ้าง
            </AlertTitle>
          </Alert>
        ) : (
          <DataTable columns={procurementColumns} data={data?.items || []} />
        )}
      </div>
      {!isLoading && data && (
        <PaginationNav
          page={data.page}
          totalPages={data.totalPages}
          onNextPage={nextPage}
          onPrevPage={prevPage}
        />
      )}
      {/* Sheet */}
      <Sheet
        open={isUpdateProcurementAction(procurementAction)}
        onOpenChange={(open) => !open && setProcurementAction(null)}
      >
        <EditProcurementSheetContent
          onClose={() =>
            isUpdateProcurementAction(procurementAction) &&
            setProcurementAction(null)
          }
          id={
            isUpdateProcurementAction(procurementAction)
              ? procurementAction.id
              : undefined
          }
        />
      </Sheet>
      <ActionConfirmDialog
        open={isDeleteProcurementAction(procurementAction)}
        onOpenChange={() => setProcurementAction(null)}
        onConfirm={() =>
          isDeleteProcurementAction(procurementAction) &&
          deleteProcurement({ id: procurementAction.id })
        }
        isPending={isDeleting}
        Title="คุณแน่ใจหรือว่าต้องการลบประกาศจัดซื้อ/จัดจ้างนี้?"
        Description="การดำเนินการนี้ไม่สามารถย้อนกลับได้"
      />
    </div>
  );
}

export default function AdminProcurementPage() {
  return (
    <ProcurementActionProvider>
      <AdminProcurementPageContent />
    </ProcurementActionProvider>
  );
}
