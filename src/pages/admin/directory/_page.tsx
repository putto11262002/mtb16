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
import { CreateDirectorySheetContent } from "@/components/directory/admin/create-directory-sheet-content";
import {
  isCreateDirectoryAction,
  isDeleteDirectoryAction,
  isUpdateDirectoryAction,
  useDirectoryAction,
} from "@/components/directory/admin/directory-action-context";
import { directoryColumns } from "@/components/directory/admin/directory-table-definition";
import { EditDirectorySheetContent } from "@/components/directory/admin/edit-directory-sheet-content";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { DataTable } from "@/components/ui/data-table";
import { useDeleteDirectoryEntry } from "@/hooks/directory/mutations";
import { useGetDirectoryEntries } from "@/hooks/directory/queries";
import { useAddToasts } from "@/hooks/react-query";
import { useGetAllTags } from "@/hooks/tag/queries";
import { usePagination } from "@/hooks/use-pagination";
import { CircleX, Plus } from "lucide-react";
import { PaginationNav } from "../_components/pagination-nav";
import { useDirectoryFilters } from "./_hooks";

export default function AdminDirectoryPage() {
  const { directoryAction, setDirectoryAction } = useDirectoryAction();

  const { mutate: deleteDirectoryEntry, isPending: isDeleting } = useAddToasts(
    useDeleteDirectoryEntry,
    {
      successMessage: "ลบรายการไดเรกทอรีเรียบร้อย",
      errorMessage: "เกิดข้อผิดพลาดในการลบรายการไดเรกทอรี",
    },
  );

  const filters = useDirectoryFilters();
  const { data: tags } = useGetAllTags("directory");

  const { page, nextPage, prevPage } = usePagination();

  const { data, isLoading, error } = useGetDirectoryEntries({
    page,
    q: filters.debouncedQ,
    tag: filters.tag,
    pageSize: 20,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 flex-1">
        <Input
          placeholder="ค้นหาไดเรกทอรี..."
          className="flex-1 sm:max-w-xs"
          value={filters.q}
          onChange={(e) => filters.setQ(e.target.value)}
        />
        <Select
          value={filters.tag || "all"}
          onValueChange={(value) => {
            filters.setTag(value === "all" ? undefined : value);
          }}
        >
          <SelectTrigger className="flex-1 w-full sm:max-w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">ทั้งหมด</SelectItem>
            {tags?.map((tag) => (
              <SelectItem key={tag} value={tag}>
                {tag}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Sheet
          onOpenChange={(open) =>
            setDirectoryAction(open ? { type: "create" } : null)
          }
          open={isCreateDirectoryAction(directoryAction)}
        >
          <SheetTrigger asChild className="sm:ml-auto flex-1 sm:flex-none">
            <Button className="">
              <Plus className="mr-2 h-4 w-4" />
              <span>สร้างรายการใหม่</span>
            </Button>
          </SheetTrigger>
          <CreateDirectorySheetContent
            onClose={() =>
              isCreateDirectoryAction(directoryAction) &&
              setDirectoryAction(null)
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
            <AlertTitle>เกิดข้อผิดพลาดในการโหลดไดเรกทอรี</AlertTitle>
          </Alert>
        ) : (
          <DataTable columns={directoryColumns} data={data?.items || []} />
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
        open={isUpdateDirectoryAction(directoryAction)}
        onOpenChange={(open) => !open && setDirectoryAction(null)}
      >
        <EditDirectorySheetContent
          onClose={() =>
            isUpdateDirectoryAction(directoryAction) && setDirectoryAction(null)
          }
          id={
            isUpdateDirectoryAction(directoryAction)
              ? directoryAction.id
              : undefined
          }
        />
      </Sheet>
      <ActionConfirmDialog
        open={isDeleteDirectoryAction(directoryAction)}
        onOpenChange={() => setDirectoryAction(null)}
        onConfirm={() =>
          isDeleteDirectoryAction(directoryAction) &&
          deleteDirectoryEntry({ id: directoryAction.id })
        }
        isPending={isDeleting}
        Title="คุณแน่ใจหรือว่าต้องการลบรายการนี้?"
        Description="การดำเนินการนี้ไม่สามารถย้อนกลับได้"
      />
    </div>
  );
}
