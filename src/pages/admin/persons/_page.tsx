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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { ActionConfirmDialog } from "@/components/common/action-confirm-dialog";
import { Loader } from "@/components/common/loader";
import { CreatePersonSheetContent } from "@/components/person/admin/create-person-sheet-content";
import { EditPersonSheetContent } from "@/components/person/admin/edit-person-sheet-content";
import {
  isCreatePersonAction,
  isDeletePersonAction,
  isUpdatePersonAction,
  usePersonAction,
} from "@/components/person/admin/person-action-context";
import { personColumns } from "@/components/person/admin/person-table-definition";
import LeadershipTree from "@/components/person/leadership-tree";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { DataTable } from "@/components/ui/data-table";
import { Config } from "@/config";
import { THAI_ARMY_RANKS } from "@/core/shared/constants";
import { useDeletePerson } from "@/hooks/person/mutation";
import { useGetPersonRankTree, useGetPersons } from "@/hooks/person/queries";
import { useAddToasts } from "@/hooks/react-query";
import { usePagination } from "@/hooks/use-pagination";
import { CircleX, Plus } from "lucide-react";
import { PaginationNav } from "../_components/pagination-nav";
import { usePersonFilters } from "./_hooks";

export default function AdminPersonPage() {
  const { personAction, setPersonAction } = usePersonAction();

  const { mutate: deletePerson, isPending: isDeleting } = useAddToasts(
    useDeletePerson,
    {
      successMessage: "ลบบุคคลเรียบร้อย",
      errorMessage: "เกิดข้อผิดพลาดในการลบบุคคล",
    },
  );

  const filters = usePersonFilters();

  const { page, nextPage, prevPage } = usePagination();

  const { data, isLoading, error } = useGetPersons({
    page,
    q: filters.debouncedQ,
    unitId: filters.unitId,
    rank: filters.rank,
    orderBy: "createdAt",
    direction: "desc",
    pageSize: 10,
  });

  const {
    data: treeData,
    isLoading: isTreeLoading,
    error: treeError,
  } = useGetPersonRankTree();

  return (
    <div className="space-y-6">
      <Tabs defaultValue="table" className="w-full">
        <TabsList>
          <TabsTrigger value="table">ตาราง</TabsTrigger>
          <TabsTrigger value="tree">แสดงตัวอย่าง</TabsTrigger>
        </TabsList>
        <TabsContent value="table" className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <Input
              placeholder="ค้นหาบุคคล..."
              className="flex-1 sm:max-w-xs"
              value={filters.q}
              onChange={(e) => filters.setQ(e.target.value)}
            />
            <Select
              value={filters.rank || "all"}
              onValueChange={(value) => {
                filters.setRank(value === "all" ? undefined : value);
              }}
            >
              <SelectTrigger className="flex-1 w-full sm:max-w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทุกยศ</SelectItem>
                {Object.keys(THAI_ARMY_RANKS).map((rank) => (
                  <SelectItem key={rank} value={rank}>
                    {rank}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Sheet
              onOpenChange={(open) =>
                setPersonAction(open ? { type: "create" } : null)
              }
              open={isCreatePersonAction(personAction)}
            >
              <SheetTrigger asChild className="sm:ml-auto flex-1 sm:flex-none">
                <Button className="">
                  <Plus className="mr-2 h-4 w-4" />
                  <span>สร้างบุคคลใหม่</span>
                </Button>
              </SheetTrigger>
              <CreatePersonSheetContent
                onClose={() =>
                  isCreatePersonAction(personAction) && setPersonAction(null)
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
                <AlertTitle>เกิดข้อผิดพลาดในการโหลดบุคคล</AlertTitle>
              </Alert>
            ) : (
              <DataTable columns={personColumns} data={data?.items || []} />
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
        </TabsContent>
        <TabsContent value="tree" className="space-y-6 overflow-hidden">
          {isTreeLoading ? (
            <Loader />
          ) : treeError ? (
            <Alert variant="destructive">
              <CircleX className="h-4 w-4 text-destructive" />
              <AlertTitle>เกิดข้อผิดพลาดในการโหลดโครงสร้าง</AlertTitle>
            </Alert>
          ) : (
            <LeadershipTree
              levels={
                treeData?.map((level) =>
                  level.map((profile) => ({
                    ...profile,
                    portrait: profile.portrait
                      ? Config.getFileURL(profile.portrait)
                      : null,
                  })),
                ) || []
              }
            />
          )}
        </TabsContent>
      </Tabs>
      {/* Sheet */}
      <Sheet
        open={isUpdatePersonAction(personAction)}
        onOpenChange={(open) => !open && setPersonAction(null)}
      >
        <EditPersonSheetContent
          onClose={() =>
            isUpdatePersonAction(personAction) && setPersonAction(null)
          }
          id={isUpdatePersonAction(personAction) ? personAction.id : undefined}
        />
      </Sheet>
      <ActionConfirmDialog
        open={isDeletePersonAction(personAction)}
        onOpenChange={() => setPersonAction(null)}
        onConfirm={() =>
          isDeletePersonAction(personAction) &&
          deletePerson({ id: personAction.id })
        }
        isPending={isDeleting}
        Title="คุณแน่ใจหรือว่าต้องการลบบุคคลนี้?"
        Description="การดำเนินการนี้ไม่สามารถย้อนกลับได้"
      />
    </div>
  );
}
