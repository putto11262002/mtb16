// External libraries
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "astro:schema";
import { Paperclip, X } from "lucide-react";
import { memo, useCallback, useRef, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

// Internal components
import { LoaderButton } from "@/components/common/loader-button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
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
import { Separator } from "@/components/ui/separator";
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { TagsFormField } from "./form/tags-form-field";

// Config and core
import { Config } from "@/config";
import {
  addAttachmentInputSchema,
  updateAnnouncementInputSchema,
  updatePreviewImageInputSchema,
  type Announcement,
} from "@/core/announcement/schema";

// Hooks
import { Loader } from "@/components/common/loader";
import { ErrorAlert } from "@/components/ui/error-alert";
import {
  useAddAttachment,
  useRemoveAttachment,
  useUpdateAnnouncement,
  useUpdatePreviewImage,
} from "@/hooks/announcement/mutation";
import { useGetAnouncement } from "@/hooks/announcement/queries";

export const EditAnnouncementSheetContent: React.FC<{
  onClose: () => void;
  id: string | undefined;
}> = ({ onClose, id }) => {
  const { data: announcement, isPending, error } = useGetAnouncement({ id });
  return (
    <SheetContent className="w-full sm:w-[540px] lg:w-[700px] xl:w-[900px] overflow-hidden">
      <SheetHeader>
        <SheetTitle>แก้ไขประกาศ</SheetTitle>
        <SheetDescription>แก้ไขรายละเอียดประกาศ</SheetDescription>
      </SheetHeader>
      <ScrollArea className="px-4 pb-8 overflow-y-auto">
        <div className="space-y-4">
          {error ? (
            <ErrorAlert>Error loading announcement: {error.message}</ErrorAlert>
          ) : isPending || !announcement ? (
            <Loader />
          ) : (
            <>
              <MetadataForm initialData={announcement} />
              <Separator />
              <PreviewImageForm
                previewImageUrl={
                  announcement?.previewImage
                    ? Config.getFileURL(announcement?.previewImage?.id)
                    : undefined
                }
                id={announcement.id}
              />
              <Separator />
              <AttachmentForm
                id={announcement.id}
                attachments={announcement.attachments}
              />
            </>
          )}
        </div>
      </ScrollArea>
    </SheetContent>
  );
};

const updateAnnouncementFormSchema = updateAnnouncementInputSchema
  .omit({ tags: true, id: true })
  .extend({
    tags: z
      .array(
        z.object({
          tag: updateAnnouncementInputSchema.shape.tags
            .innerType()
            .innerType()
            .unwrap().element,
        }),
      )
      .optional(),
  });

// Form component for updating announcement metadata
const MetadataForm = memo(({ initialData }: { initialData: Announcement }) => {
  const form = useForm({
    resolver: zodResolver(updateAnnouncementFormSchema),
    defaultValues: {
      title: initialData.title,
      body: initialData.body ?? undefined,
      tags: initialData.tags?.map((tag) => ({ tag })),
    },
  });

  const tags = useFieldArray({ control: form.control, name: "tags" });

  const { mutate, isPending } = useUpdateAnnouncement();

  // Handler for form submission, memoized to prevent recreation
  const handleSubmit = useCallback(
    (data: z.infer<typeof updateAnnouncementFormSchema>) => {
      console.log(data);
      mutate(
        { ...data, tags: data.tags?.map((t) => t.tag), id: initialData.id },
        {
          onSuccess: () => {
            toast.success("แก้ไขประกาศสำเร็จ");
          },
          onError: () => {
            toast.error("แก้ไขประกาศไม่สำเร็จ");
          },
        },
      );
    },
    [mutate, initialData.id],
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
          name="body"
          render={({ field }) => (
            <FormItem>
              <FormLabel>เนื้อหา</FormLabel>
              <FormControl>
                <Textarea placeholder="เนื้อหาประกาศ" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <TagsFormField
          tags={tags.fields}
          onRemove={tags.remove}
          onAdd={(tag) => tags.append({ tag })}
        />

        <LoaderButton type="submit" isLoading={isPending}>
          บันทึก
        </LoaderButton>
      </form>
    </Form>
  );
});

const previewImageFormSchema = updatePreviewImageInputSchema.omit({ id: true });
// Form component for updating announcement preview image
const PreviewImageForm = memo(
  ({ previewImageUrl, id }: { previewImageUrl?: string; id: string }) => {
    const form = useForm({
      resolver: zodResolver(previewImageFormSchema),
    });
    const { mutate, isPending } = useUpdatePreviewImage();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Handler for updating preview image, memoized to prevent recreation
    const update = useCallback(
      (data: z.infer<typeof previewImageFormSchema>) =>
        mutate(
          { ...data, id },
          {
            onSuccess: () => {
              toast.success("อัปเดตภาพปกสำเร็จ");
              fileInputRef.current!.value = "";
            },
            onError: () => {
              toast.error("อัปเดตภาพปกไม่สำเร็จ");
            },
          },
        ),
      [mutate, id],
    );

    return (
      <div className="space-y-4">
        <AspectRatio
          ratio={16 / 9}
          className="w-full rounded-md overflow-hidden bg-muted"
        >
          {previewImageUrl && (
            <img
              src={previewImageUrl}
              alt="Preview Image"
              className="object-cover w-full h-full"
            />
          )}
        </AspectRatio>
        <Form {...form}>
          <form className="grid gap-4" onSubmit={form.handleSubmit(update)}>
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ภาพปก</FormLabel>
                  <FormControl>
                    <Input
                      ref={fileInputRef}
                      type="file"
                      onChange={(e) => field.onChange(e.target.files?.[0])}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <LoaderButton type="submit" isLoading={isPending}>
              บันทึกภาพปก
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

const addAttachmentFormSchema = addAttachmentInputSchema.omit({ id: true });

// Form component for managing announcement attachments
const AttachmentForm = memo(
  ({
    attachments,
    id,
  }: {
    id: string;
    attachments: Announcement["attachments"];
  }) => {
    const form = useForm({
      resolver: zodResolver(addAttachmentFormSchema),
      defaultValues: addAttachmentFormDefaultValues,
    });
    const [removingId, setRemovingId] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { mutate: _add, isPending: isAdding } = useAddAttachment();
    const { mutate: _remove, isPending: isRemoving } = useRemoveAttachment();

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
          {attachments?.map((attachment) => (
            <div
              key={attachment.id}
              className="flex items-center justify-between px-2 py-1 border rounded gap-1 w-full"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Paperclip className="w-3.5 h-3.5 text-muted-foreground" />
                <a
                  href={Config.getFileURL(attachment.id)}
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
          ))}
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
