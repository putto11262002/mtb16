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

import {
  isCreateAnnouncementAction,
  isDeleteAnnouncementAction,
  isPublishAnnouncementAction,
  isUnpublishAnnouncementAction,
  isUpdateAnnouncementAction,
  useAnnouncementAction,
} from "@/components/announcement/admin/announcement-action-context";
import { announcementColumns } from "@/components/announcement/admin/announcement-table-definition";
import { CreateAnnouncementSheetContent } from "@/components/announcement/admin/create-announcement-sheet-content";
import { EditAnnouncementSheetContent } from "@/components/announcement/admin/edit-announcement-sheet-content";
import { ActionConfirmDialog } from "@/components/common/action-confirm-dialog";
import { Loader } from "@/components/common/loader";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { DataTable } from "@/components/ui/data-table";
import {
  useDeleteAnnouncement,
  usePublishAnnouncement,
  useUnpublishAnnouncement,
} from "@/hooks/announcement/mutation";
import { useGetAnnouncements } from "@/hooks/announcement/queries";
import { useAddToasts } from "@/hooks/react-query";
import { usePagination } from "@/hooks/use-pagination";
import { CircleX, Plus } from "lucide-react";
import { PaginationNav } from "../_components/pagination-nav";
import { useAnnouncementFilters } from "./_hooks";

export default function AdminAnnouncementPage() {
  const { announcementAction, setAnnouncementAction } = useAnnouncementAction();

  const { mutate: deleteAnnouncement, isPending: isDeleting } = useAddToasts(
    useDeleteAnnouncement,
    {
      successMessage: "ลบประกาศเรียบร้อย",
      errorMessage: "เกิดข้อผิดพลาดในการลบประกาศ",
    },
  );

  const { mutate: unpublishAnnouncement, isPending: isUnpublishing } =
    useAddToasts(useUnpublishAnnouncement, {
      successMessage: "ยกเลิกการเผยแพร่ประกาศเรียบร้อย",
      errorMessage: "เกิดข้อผิดพลาดในการยกเลิกการเผยแพร่ประกาศ",
    });

  const { mutate: publishAnnouncement, isPending: isPublishing } = useAddToasts(
    usePublishAnnouncement,
    {
      successMessage: "เผยแพร่ประกาศเรียบร้อย",
      errorMessage: "เกิดข้อผิดพลาดในการเผยแพร่ประกาศ",
    },
  );

  const filters = useAnnouncementFilters();

  const { page, nextPage, prevPage } = usePagination();

  const { data, isLoading, error } = useGetAnnouncements({
    page,
    q: filters.debouncedQ,
    published: filters.published,
    orderBy: "createdAt",
    direction: "desc",
    pageSize: 10,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 flex-1">
        <Input
          placeholder="ค้นหาประกาศ..."
          className="flex-1 sm:max-w-xs"
          value={filters.q}
          onChange={(e) => filters.setQ(e.target.value)}
        />
        <Select
          value={
            filters.published === undefined ? "all" : String(filters.published)
          }
          onValueChange={(value) => {
            filters.setPublished(
              value === "all" ? undefined : value === "true",
            );
          }}
        >
          <SelectTrigger className="flex-1 w-full sm:max-w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">ทั้งหมด</SelectItem>
            <SelectItem value="true">เผยแพร่แล้ว</SelectItem>
            <SelectItem value="false">ร่าง</SelectItem>
          </SelectContent>
        </Select>
        <Sheet
          onOpenChange={(open) =>
            setAnnouncementAction(open ? { type: "create" } : null)
          }
          open={isCreateAnnouncementAction(announcementAction)}
        >
          <SheetTrigger asChild className="sm:ml-auto flex-1 sm:flex-none">
            <Button className="">
              <Plus className="mr-2 h-4 w-4" />
              <span>สร้างประกาศใหม่</span>
            </Button>
          </SheetTrigger>
          <CreateAnnouncementSheetContent
            onClose={() =>
              isCreateAnnouncementAction(announcementAction) &&
              setAnnouncementAction(null)
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
            <AlertTitle>เกิดข้อผิดพลาดในการโหลดประกาศ</AlertTitle>
          </Alert>
        ) : (
          <DataTable columns={announcementColumns} data={data?.items || []} />
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
        open={isUpdateAnnouncementAction(announcementAction)}
        onOpenChange={(open) => !open && setAnnouncementAction(null)}
      >
        <EditAnnouncementSheetContent
          onClose={() =>
            isUpdateAnnouncementAction(announcementAction) &&
            setAnnouncementAction(null)
          }
          id={
            isUpdateAnnouncementAction(announcementAction)
              ? announcementAction.id
              : undefined
          }
        />
      </Sheet>
      <ActionConfirmDialog
        open={isDeleteAnnouncementAction(announcementAction)}
        onOpenChange={() => setAnnouncementAction(null)}
        onConfirm={() =>
          isDeleteAnnouncementAction(announcementAction) &&
          deleteAnnouncement({ id: announcementAction.id })
        }
        isPending={isDeleting}
        Title="คุณแน่ใจหรือว่าต้องการลบประกาศนี้?"
        Description="การดำเนินการนี้ไม่สามารถย้อนกลับได้"
      />
      <ActionConfirmDialog
        open={isUnpublishAnnouncementAction(announcementAction)}
        onOpenChange={() => setAnnouncementAction(null)}
        onConfirm={() =>
          isUnpublishAnnouncementAction(announcementAction) &&
          unpublishAnnouncement(announcementAction.id)
        }
        isPending={isUnpublishing}
        Title="คุณแน่ใจหรือว่าต้องการยกเลิกการเผยแพร่ประกาศนี้?"
        Description="การดำเนินการนี้จะทำให้ประกาศนี้กลับไปเป็นร่าง"
      />
      <ActionConfirmDialog
        open={isPublishAnnouncementAction(announcementAction)}
        onOpenChange={() => setAnnouncementAction(null)}
        onConfirm={() =>
          isPublishAnnouncementAction(announcementAction) &&
          publishAnnouncement(announcementAction.id)
        }
        isPending={isPublishing}
        Title="คุณแน่ใจหรือว่าต้องการเผยแพร่ประกาศนี้?"
        Description="การดำเนินการนี้จะทำให้ประกาศนี้เผยแพร่ต่อสาธารณะ"
      />
    </div>
  );
}
