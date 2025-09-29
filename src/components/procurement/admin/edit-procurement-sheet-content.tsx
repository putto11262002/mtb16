import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "astro:schema";
import { CalendarIcon, Paperclip, X } from "lucide-react";
import { memo, useCallback, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";

import { Config } from "@/config";
import {
  addProcurementAttachmentInputSchema,
  updateInvitationDocsInputSchema,
  updatePriceDisclosureDocsInputSchema,
  updateWinnerDeclarationDocsInputSchema,
} from "@/core/procurement/schema";
import type { Procurement } from "@/db/schema";

import {
  useAddProcurementAttachment,
  useRemoveProcurementAttachment,
  useUpdateInvitationDocs,
  useUpdatePriceDisclosureDocs,
  useUpdateProcurement,
  useUpdateWinnerDeclarationDocs,
} from "@/hooks/procurement/mutations";
import { useGetProcurement } from "@/hooks/procurement/queries";

import { Loader } from "@/components/common/loader";
import { LoaderButton } from "@/components/common/loader-button";
import Calendar from "@/components/ui/calendar";
import { ErrorAlert } from "@/components/ui/error-alert";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export const EditProcurementSheetContent: React.FC<{
  onClose: () => void;
  id: string | undefined;
}> = ({ onClose, id }) => {
  const { data: procurement, isPending, error } = useGetProcurement({ id });
  return (
    <SheetContent className="w-full sm:w-[540px] lg:w-[700px] xl:w-[900px] overflow-hidden">
      <SheetHeader>
        <SheetTitle>แก้ไขประกาศจัดซื้อ/จัดจ้าง</SheetTitle>
        <SheetDescription>แก้ไขรายละเอียดประกาศ</SheetDescription>
      </SheetHeader>
      <ScrollArea className="px-4 pb-8 overflow-y-auto">
        <div className="space-y-4">
          {error ? (
            <ErrorAlert>Error loading procurement: {error.message}</ErrorAlert>
          ) : isPending || !procurement ? (
            <Loader />
          ) : (
            <>
              <MetadataForm initialData={procurement} onClose={onClose} />
              <Separator />
              <InvitationDocsForm
                invitationDocs={procurement.invitation}
                id={procurement.id}
              />
              <Separator />
              <PriceDisclosureDocsForm
                priceDisclosureDocs={procurement.priceDisclosure}
                id={procurement.id}
              />
              <Separator />
              <WinnerDeclarationDocsForm
                winnerDeclarationDocs={procurement.winnerDeclaration}
                id={procurement.id}
              />
              <Separator />
              <AttachmentForm
                id={procurement.id}
                attachments={procurement.attachments}
              />
            </>
          )}
        </div>
      </ScrollArea>
    </SheetContent>
  );
};

const updateProcurementFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "หัวข้อต้องมีอย่างน้อย 3 ตัวอักษร")
    .max(255, "หัวข้อต้องไม่เกิน 255 ตัวอักษร"),
  status: z.enum(["open", "closed"]),
  date: z.date(),
  details: z
    .string()
    .trim()
    .max(5000, "รายละเอียดต้องไม่เกิน 5000 ตัวอักษร")
    .optional(),
});

// Form component for updating procurement metadata
const MetadataForm = memo(
  ({
    initialData,
    onClose,
  }: {
    initialData: Procurement;
    onClose: () => void;
  }) => {
    const form = useForm({
      resolver: zodResolver(updateProcurementFormSchema),
      defaultValues: {
        title: initialData.title,
        status: initialData.status as "open" | "closed",
        date: new Date(initialData.date),
        details: initialData.details || "",
      },
    });

    const { mutate, isPending } = useUpdateProcurement();

    // Handler for form submission, memoized to prevent recreation
    const handleSubmit = useCallback(
      (data: z.infer<typeof updateProcurementFormSchema>) => {
        mutate(
          { ...data, id: initialData.id },
          {
            onSuccess: () => {
              toast.success("แก้ไขประกาศสำเร็จ");
              onClose();
            },
            onError: () => {
              toast.error("แก้ไขประกาศไม่สำเร็จ");
            },
          },
        );
      },
      [mutate, initialData.id, onClose],
    );

    return (
      <Form {...form}>
        <form className="grid gap-4" onSubmit={form.handleSubmit(handleSubmit)}>
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>หัวข้อ</FormLabel>
                <FormControl>
                  <Input placeholder="หัวข้อประกาศ" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>สถานะ</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกสถานะ" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="open">เปิดรับ</SelectItem>
                    <SelectItem value="closed">ปิดแล้ว</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>วันที่</FormLabel>
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>เลือกวันที่</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="details"
            render={({ field }) => (
              <FormItem>
                <FormLabel>รายละเอียด</FormLabel>
                <FormControl>
                  <Textarea placeholder="รายละเอียดประกาศ" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <LoaderButton type="submit" isLoading={isPending}>
            บันทึก
          </LoaderButton>
        </form>
      </Form>
    );
  },
);

const invitationDocsFormSchema = updateInvitationDocsInputSchema.omit({
  id: true,
});
// Form component for updating invitation docs
const InvitationDocsForm = memo(
  ({
    invitationDocs,
    id,
  }: {
    invitationDocs?: Procurement["invitation"];
    id: string;
  }) => {
    const form = useForm({
      resolver: zodResolver(invitationDocsFormSchema),
    });
    const { mutate, isPending } = useUpdateInvitationDocs();

    // Handler for updating invitation docs, memoized to prevent recreation
    const update = useCallback(
      (data: z.infer<typeof invitationDocsFormSchema>) =>
        mutate(
          { ...data, id },
          {
            onSuccess: () => {
              toast.success("อัปเดตเอกสารเชิญชวนสำเร็จ");
            },
            onError: () => {
              toast.error("อัปเดตเอกสารเชิญชวนไม่สำเร็จ");
            },
          },
        ),
      [mutate, id],
    );

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          {invitationDocs?.map((doc: { id: string }, index: number) => (
            <div
              key={doc.id}
              className="flex items-center gap-2 px-2 py-1 border rounded"
            >
              <Paperclip className="w-3.5 h-3.5 text-muted-foreground" />
              <a
                href={Config.getFileURL(doc.id)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-sm underline overflow-hidden text-ellipsis"
              >
                เอกสารเชิญชวน {index + 1}
              </a>
            </div>
          ))}
        </div>
        <Form {...form}>
          <form className="grid gap-4" onSubmit={form.handleSubmit(update)}>
            <FormField
              control={form.control}
              name="files"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>เอกสารเชิญชวน</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx"
                      onChange={(e) =>
                        field.onChange(Array.from(e.target.files || []))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <LoaderButton type="submit" isLoading={isPending}>
              อัปโหลดเอกสารเชิญชวน
            </LoaderButton>
          </form>
        </Form>
      </div>
    );
  },
);

const priceDisclosureDocsFormSchema = updatePriceDisclosureDocsInputSchema.omit(
  { id: true },
);
// Form component for updating price disclosure docs
const PriceDisclosureDocsForm = memo(
  ({
    priceDisclosureDocs,
    id,
  }: {
    priceDisclosureDocs?: Procurement["priceDisclosure"];
    id: string;
  }) => {
    const form = useForm({
      resolver: zodResolver(priceDisclosureDocsFormSchema),
    });
    const { mutate, isPending } = useUpdatePriceDisclosureDocs();

    // Handler for updating price disclosure docs, memoized to prevent recreation
    const update = useCallback(
      (data: z.infer<typeof priceDisclosureDocsFormSchema>) =>
        mutate(
          { ...data, id },
          {
            onSuccess: () => {
              toast.success("อัปเดตเอกสารประกวดราคาสำเร็จ");
            },
            onError: () => {
              toast.error("อัปเดตเอกสารประกวดราคาไม่สำเร็จ");
            },
          },
        ),
      [mutate, id],
    );

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          {priceDisclosureDocs?.map((doc: { id: string }, index: number) => (
            <div
              key={doc.id}
              className="flex items-center gap-2 px-2 py-1 border rounded"
            >
              <Paperclip className="w-3.5 h-3.5 text-muted-foreground" />
              <a
                href={Config.getFileURL(doc.id)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-sm underline overflow-hidden text-ellipsis"
              >
                เอกสารประกวดราคา {index + 1}
              </a>
            </div>
          ))}
        </div>
        <Form {...form}>
          <form className="grid gap-4" onSubmit={form.handleSubmit(update)}>
            <FormField
              control={form.control}
              name="files"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>เอกสารประกวดราคา</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx"
                      onChange={(e) =>
                        field.onChange(Array.from(e.target.files || []))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <LoaderButton type="submit" isLoading={isPending}>
              อัปโหลดเอกสารประกวดราคา
            </LoaderButton>
          </form>
        </Form>
      </div>
    );
  },
);

const winnerDeclarationDocsFormSchema =
  updateWinnerDeclarationDocsInputSchema.omit({ id: true });
// Form component for updating winner declaration docs
const WinnerDeclarationDocsForm = memo(
  ({
    winnerDeclarationDocs,
    id,
  }: {
    winnerDeclarationDocs?: Procurement["winnerDeclaration"];
    id: string;
  }) => {
    const form = useForm({
      resolver: zodResolver(winnerDeclarationDocsFormSchema),
    });
    const { mutate, isPending } = useUpdateWinnerDeclarationDocs();

    // Handler for updating winner declaration docs, memoized to prevent recreation
    const update = useCallback(
      (data: z.infer<typeof winnerDeclarationDocsFormSchema>) =>
        mutate(
          { ...data, id },
          {
            onSuccess: () => {
              toast.success("อัปเดตประกาศผู้ชนะสำเร็จ");
            },
            onError: () => {
              toast.error("อัปเดตประกาศผู้ชนะไม่สำเร็จ");
            },
          },
        ),
      [mutate, id],
    );

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          {winnerDeclarationDocs?.map((doc: { id: string }, index: number) => (
            <div
              key={doc.id}
              className="flex items-center gap-2 px-2 py-1 border rounded"
            >
              <Paperclip className="w-3.5 h-3.5 text-muted-foreground" />
              <a
                href={Config.getFileURL(doc.id)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-sm underline overflow-hidden text-ellipsis"
              >
                ประกาศผู้ชนะ {index + 1}
              </a>
            </div>
          ))}
        </div>
        <Form {...form}>
          <form className="grid gap-4" onSubmit={form.handleSubmit(update)}>
            <FormField
              control={form.control}
              name="files"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ประกาศผู้ชนะ</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx"
                      onChange={(e) =>
                        field.onChange(Array.from(e.target.files || []))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <LoaderButton type="submit" isLoading={isPending}>
              อัปโหลดประกาศผู้ชนะ
            </LoaderButton>
          </form>
        </Form>
      </div>
    );
  },
);

const addAttachmentFormDefaultValues = {
  label: "",
  file: undefined as any,
};

const addAttachmentFormSchema = addProcurementAttachmentInputSchema.omit({
  id: true,
});

// Form component for managing procurement attachments
const AttachmentForm = memo(
  ({
    attachments,
    id,
  }: {
    id: string;
    attachments: Procurement["attachments"];
  }) => {
    const form = useForm({
      resolver: zodResolver(addAttachmentFormSchema),
      defaultValues: addAttachmentFormDefaultValues,
    });
    const [removingId, setRemovingId] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { mutate: _add, isPending: isAdding } = useAddProcurementAttachment();
    const { mutate: _remove, isPending: isRemoving } =
      useRemoveProcurementAttachment();

    const resetForm = useCallback(() => {
      form.reset(addAttachmentFormDefaultValues);
      fileInputRef.current!.value = "";
    }, [form]);

    // Handler for adding attachment, memoized to prevent recreation
    const add = useCallback(
      (data: z.infer<typeof addAttachmentFormSchema>) =>
        _add(
          { ...data, id },
          {
            onSuccess: () => {
              toast.success("เพิ่มไฟล์แนบสำเร็จ");
              resetForm();
            },
            onError: () => {
              toast.error("เพิ่มไฟล์แนบไม่สำเร็จ");
            },
          },
        ),
      [_add, id, resetForm],
    );

    // Handler for removing attachment, memoized to prevent recreation
    const remove = useCallback(
      ({ attachmentId }: { attachmentId: string }) => {
        setRemovingId(attachmentId);
        _remove(
          { attachmentId, id },
          {
            onSuccess: () => {
              toast.success("ลบไฟล์แนบสำเร็จ");
            },
            onError: () => {
              toast.error("ลบไฟล์แนบไม่สำเร็จ");
            },
            onSettled: () => {
              setRemovingId(null);
            },
          },
        );
      },
      [_remove, id],
    );

    return (
      <div className="space-y-6">
        <div className="space-y-2">
          {attachments?.map(
            (attachment: {
              id: string;
              file: { id: string };
              label: string;
            }) => (
              <div
                key={attachment.id}
                className="flex items-center justify-between px-2 py-1 border rounded gap-1 w-full"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <Paperclip className="w-3.5 h-3.5 text-muted-foreground" />
                  <a
                    href={Config.getFileURL(attachment.file.id)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-sm underline overflow-hidden text-ellipsis"
                  >
                    {attachment.label}
                  </a>
                </div>
                <LoaderButton
                  className="w-7 h-7"
                  inplace
                  variant="ghost"
                  size="icon"
                  isLoading={isRemoving && removingId === attachment.id}
                  onClick={() => remove({ attachmentId: attachment.id })}
                  type="button"
                >
                  <X className="w-4 h-4" />
                </LoaderButton>
              </div>
            ),
          )}
        </div>
        <Form {...form}>
          <form className="grid gap-4" onSubmit={form.handleSubmit(add)}>
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ป้ายชื่อ</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="ป้ายชื่อไฟล์แนบ" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ไฟล์</FormLabel>
                  <FormControl>
                    <Input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
                      onChange={(e) => field.onChange(e.target.files?.[0])}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <LoaderButton type="submit" isLoading={isAdding}>
              เพิ่มไฟล์แนบ
            </LoaderButton>
          </form>
        </Form>
      </div>
    );
  },
);
