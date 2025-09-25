// External libraries
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "astro:schema";
import { Paperclip, X } from "lucide-react";
import { memo, useCallback, useRef, useState } from "react";
import { useForm } from "react-hook-form";
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

// Config and core
import { Config } from "@/config";
import {
  addAttachmentInputSchema,
  updateNewsInputSchema,
  updatePreviewImageInputSchema,
  type News,
} from "@/core/news/schema";

// Hooks
import { Loader } from "@/components/common/loader";
import { ErrorAlert } from "@/components/ui/error-alert";
import {
  useAddNewsAttachment,
  useRemoveNewsAttachment,
  useUpdateNews,
  useUpdateNewsPreviewImage,
} from "@/hooks/news/mutation";
import { useGetNewsById } from "@/hooks/news/queries";

export const EditNewsSheetContent: React.FC<{
  onClose: () => void;
  id: string | undefined;
}> = ({ onClose, id }) => {
  const { data: news, isPending, error } = useGetNewsById({ id });
  return (
    <SheetContent className="w-full sm:w-[540px] lg:w-[700px] xl:w-[900px] overflow-hidden">
      <SheetHeader>
        <SheetTitle>แก้ไขข่าว</SheetTitle>
        <SheetDescription>แก้ไขรายละเอียดข่าว</SheetDescription>
      </SheetHeader>
      <ScrollArea className="px-4 pb-8 overflow-y-auto">
        <div className="space-y-4">
          {error ? (
            <ErrorAlert>Error loading news: {error.message}</ErrorAlert>
          ) : isPending || !news ? (
            <Loader />
          ) : (
            <>
              <MetadataForm initialData={news} />
              <Separator />
              <PreviewImageForm
                previewImageUrl={
                  news?.previewImage
                    ? Config.getFileURL(news?.previewImage?.id)
                    : undefined
                }
                id={news.id}
              />
              <Separator />
              <AttachmentForm id={news.id} attachments={news.attachments} />
            </>
          )}
        </div>
      </ScrollArea>
    </SheetContent>
  );
};

const updateNewsFormSchema = updateNewsInputSchema.omit({
  id: true,
});

// Form component for updating news metadata
const MetadataForm = memo(({ initialData }: { initialData: News }) => {
  const form = useForm({
    resolver: zodResolver(updateNewsFormSchema),
    defaultValues: {
      title: initialData.title,
      body: initialData.body ?? undefined,
    },
  });

  const { mutate, isPending } = useUpdateNews();

  // Handler for form submission, memoized to prevent recreation
  const handleSubmit = useCallback(
    (data: z.infer<typeof updateNewsFormSchema>) => {
      console.log(data);
      mutate(
        { ...data, id: initialData.id },
        {
          onSuccess: () => {
            toast.success("แก้ไขข่าวสำเร็จ");
          },
          onError: () => {
            toast.error("แก้ไขข่าวไม่สำเร็จ");
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
                <Input placeholder="หัวข้อข่าว" {...field} />
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
                <Textarea placeholder="เนื้อหาข่าว" {...field} />
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
});

const previewImageFormSchema = updatePreviewImageInputSchema.omit({ id: true });
// Form component for updating news preview image
const PreviewImageForm = memo(
  ({ previewImageUrl, id }: { previewImageUrl?: string; id: string }) => {
    const form = useForm({
      resolver: zodResolver(previewImageFormSchema),
    });
    const { mutate, isPending } = useUpdateNewsPreviewImage();
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

// Form component for managing news attachments
const AttachmentForm = memo(
  ({ attachments, id }: { id: string; attachments: News["attachments"] }) => {
    const form = useForm({
      resolver: zodResolver(addAttachmentFormSchema),
      defaultValues: addAttachmentFormDefaultValues,
    });
    const [removingId, setRemovingId] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { mutate: _add, isPending: isAdding } = useAddNewsAttachment();
    const { mutate: _remove, isPending: isRemoving } =
      useRemoveNewsAttachment();

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
