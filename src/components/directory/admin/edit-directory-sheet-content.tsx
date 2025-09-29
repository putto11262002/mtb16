import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "astro:schema";
import { memo, useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

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
import { TagField } from "@/components/ui/tag-field";
import { Textarea } from "@/components/ui/textarea";

import { Config } from "@/config";
import { updateDirectoryEntryInputSchema } from "@/core/directory/schema";
import type { DirectoryEntry } from "@/db/schema";

import { Loader } from "@/components/common/loader";
import { ErrorAlert } from "@/components/ui/error-alert";
import {
  useUpdateDirectoryEntry,
  useUpdateDirectoryEntryImage,
} from "@/hooks/directory/mutations";
import { useGetDirectoryEntry } from "@/hooks/directory/queries";

export const EditDirectorySheetContent: React.FC<{
  onClose: () => void;
  id: string | undefined;
}> = ({ onClose, id }) => {
  const {
    data: directoryEntry,
    isPending,
    error,
  } = useGetDirectoryEntry({ id });
  return (
    <SheetContent className="w-full sm:w-[540px] lg:w-[700px] xl:w-[900px] overflow-hidden">
      <SheetHeader>
        <SheetTitle>แก้ไขรายการไดเรกทอรี</SheetTitle>
        <SheetDescription>แก้ไขรายละเอียดรายการ</SheetDescription>
      </SheetHeader>
      <ScrollArea className="px-4 pb-8 overflow-y-auto">
        <div className="space-y-4">
          {error ? (
            <ErrorAlert>
              Error loading directory entry: {error.message}
            </ErrorAlert>
          ) : isPending || !directoryEntry ? (
            <Loader />
          ) : (
            <>
              <MetadataForm initialData={directoryEntry} />
              <Separator />
              <ImageForm
                imageUrl={
                  directoryEntry?.image
                    ? Config.getFileURL(directoryEntry?.image?.id)
                    : undefined
                }
                id={directoryEntry.id}
              />
            </>
          )}
        </div>
      </ScrollArea>
    </SheetContent>
  );
};

const updateDirectoryFormSchema = updateDirectoryEntryInputSchema.omit({
  id: true,
});

const MetadataForm = memo(
  ({ initialData }: { initialData: DirectoryEntry }) => {
    const form = useForm({
      resolver: zodResolver(updateDirectoryFormSchema),
      defaultValues: {
        name: initialData.name,
        tag: initialData.tag ?? undefined,
        link: initialData.link ?? "",
        phone: initialData.phone ?? "",
        email: initialData.email ?? "",
        notes: initialData.notes ?? "",
      },
    });

    const { mutate, isPending } = useUpdateDirectoryEntry();

    const handleSubmit = useCallback(
      (data: z.infer<typeof updateDirectoryFormSchema>) => {
        mutate(
          { ...data, id: initialData.id },
          {
            onSuccess: () => {
              toast.success("แก้ไขรายการสำเร็จ");
            },
            onError: () => {
              toast.error("แก้ไขรายการไม่สำเร็จ");
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ชื่อ</FormLabel>
                <FormControl>
                  <Input placeholder="ชื่อรายการ" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tag"
            render={({ field }) => (
              <FormItem>
                <FormLabel>แท็ก</FormLabel>
                <FormControl>
                  <TagField
                    type="directory"
                    value={field.value ? [field.value] : []}
                    onChange={(value) => field.onChange(value[0] || undefined)}
                    multiple={false}
                    placeholder="เลือกแท็ก"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="link"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ลิงก์</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>โทรศัพท์</FormLabel>
                <FormControl>
                  <Input placeholder="02-123-4567" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>อีเมล</FormLabel>
                <FormControl>
                  <Input placeholder="example@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>หมายเหตุ</FormLabel>
                <FormControl>
                  <Textarea placeholder="หมายเหตุเพิ่มเติม" {...field} />
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

const updateImageFormSchema = z.object({
  file: z.instanceof(Blob),
});

const ImageForm = memo(
  ({ imageUrl, id }: { imageUrl?: string; id: string }) => {
    const form = useForm({
      resolver: zodResolver(updateImageFormSchema),
    });
    const { mutate, isPending } = useUpdateDirectoryEntryImage();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const update = useCallback(
      (data: z.infer<typeof updateImageFormSchema>) =>
        mutate(
          { ...data, id },
          {
            onSuccess: () => {
              toast.success("อัปเดตรูปภาพสำเร็จ");
              fileInputRef.current!.value = "";
            },
            onError: () => {
              toast.error("อัปเดตรูปภาพไม่สำเร็จ");
            },
          },
        ),
      [mutate, id],
    );

    return (
      <div className="space-y-4">
        <AspectRatio
          ratio={1 / 1}
          className="w-full rounded-md overflow-hidden bg-muted"
        >
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Directory Image"
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
                  <FormLabel>รูปภาพ</FormLabel>
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
              บันทึกภาพ
            </LoaderButton>
          </form>
        </Form>
      </div>
    );
  },
);
