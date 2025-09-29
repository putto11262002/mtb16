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
import { CreateNewsSheetContent } from "@/components/news/admin/create-news-sheet-content";
import { EditNewsSheetContent } from "@/components/news/admin/edit-news-sheet-content";
import {
  isCreateNewsAction,
  isDeleteNewsAction,
  isPublishNewsAction,
  isUnpublishNewsAction,
  isUpdateNewsAction,
  useNewsAction,
} from "@/components/news/admin/news-action-context";
import { newsColumns } from "@/components/news/admin/news-table-definition";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { DataTable } from "@/components/ui/data-table";
import {
  useDeleteNews,
  usePublishNews,
  useUnpublishNews,
} from "@/hooks/news/mutation";
import { useGetNews } from "@/hooks/news/queries";
import { useAddToasts } from "@/hooks/react-query";
import { usePagination } from "@/hooks/use-pagination";
import { CircleX, Plus } from "lucide-react";
import { PaginationNav } from "../_components/pagination-nav";
import { useNewsFilters } from "./_hooks";

export default function AdminNewsPage() {
  const { newsAction, setNewsAction } = useNewsAction();

  const { mutate: deleteNews, isPending: isDeleting } = useAddToasts(
    useDeleteNews,
    {
      successMessage: "ลบข่าวเรียบร้อย",
      errorMessage: "เกิดข้อผิดพลาดในการลบข่าว",
    },
  );

  const { mutate: unpublishNews, isPending: isUnpublishing } = useAddToasts(
    useUnpublishNews,
    {
      successMessage: "ยกเลิกการเผยแพร่ข่าวเรียบร้อย",
      errorMessage: "เกิดข้อผิดพลาดในการยกเลิกการเผยแพร่ข่าว",
    },
  );

  const { mutate: publishNews, isPending: isPublishing } = useAddToasts(
    usePublishNews,
    {
      successMessage: "เผยแพร่ข่าวเรียบร้อย",
      errorMessage: "เกิดข้อผิดพลาดในการเผยแพร่ข่าว",
    },
  );

  const filters = useNewsFilters();

  const { page, nextPage, prevPage } = usePagination();

  const { data, isLoading, error } = useGetNews({
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
          placeholder="ค้นหาข่าว..."
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
            setNewsAction(open ? { type: "create" } : null)
          }
          open={isCreateNewsAction(newsAction)}
        >
          <SheetTrigger asChild className="sm:ml-auto flex-1 sm:flex-none">
            <Button className="">
              <Plus className="mr-2 h-4 w-4" />
              <span>สร้างข่าวใหม่</span>
            </Button>
          </SheetTrigger>
          <CreateNewsSheetContent
            onClose={() =>
              isCreateNewsAction(newsAction) && setNewsAction(null)
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
            <AlertTitle>เกิดข้อผิดพลาดในการโหลดข่าว</AlertTitle>
          </Alert>
        ) : (
          <DataTable columns={newsColumns} data={data?.items || []} />
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
        open={isUpdateNewsAction(newsAction)}
        onOpenChange={(open) => !open && setNewsAction(null)}
      >
        <EditNewsSheetContent
          onClose={() => isUpdateNewsAction(newsAction) && setNewsAction(null)}
          id={isUpdateNewsAction(newsAction) ? newsAction.id : undefined}
        />
      </Sheet>
      <ActionConfirmDialog
        open={isDeleteNewsAction(newsAction)}
        onOpenChange={() => setNewsAction(null)}
        onConfirm={() =>
          isDeleteNewsAction(newsAction) && deleteNews({ id: newsAction.id })
        }
        isPending={isDeleting}
        Title="คุณแน่ใจหรือว่าต้องการลบข่าวนี้?"
        Description="การดำเนินการนี้ไม่สามารถย้อนกลับได้"
      />
      <ActionConfirmDialog
        open={isUnpublishNewsAction(newsAction)}
        onOpenChange={() => setNewsAction(null)}
        onConfirm={() =>
          isUnpublishNewsAction(newsAction) && unpublishNews(newsAction.id)
        }
        isPending={isUnpublishing}
        Title="คุณแน่ใจหรือว่าต้องการยกเลิกการเผยแพร่ข่าวนี้?"
        Description="การดำเนินการนี้จะทำให้ข่าวนี้กลับไปเป็นร่าง"
      />
      <ActionConfirmDialog
        open={isPublishNewsAction(newsAction)}
        onOpenChange={() => setNewsAction(null)}
        onConfirm={() =>
          isPublishNewsAction(newsAction) && publishNews(newsAction.id)
        }
        isPending={isPublishing}
        Title="คุณแน่ใจหรือว่าต้องการเผยแพร่ข่าวนี้?"
        Description="การดำเนินการนี้จะทำให้ข่าวนี้เผยแพร่ต่อสาธารณะ"
      />
    </div>
  );
}
