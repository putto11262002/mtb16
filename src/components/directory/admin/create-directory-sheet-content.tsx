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
import {
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { TagField } from "@/components/ui/tag-field";
import { Textarea } from "@/components/ui/textarea";
import { createDirectoryEntryInputSchema } from "@/core/directory/schema";
import { useCreateDirectoryEntry } from "@/hooks/directory/mutations";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "astro:schema";
import { Loader2 } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const defaultValues = {
  name: "",
  tag: undefined,
  link: "",
  phone: "",
  email: "",
  notes: "",
};

const createDirectoryFormSchema = createDirectoryEntryInputSchema;

export const CreateDirectorySheetContent: React.FC<{
  onClose?: () => void;
}> = ({ onClose }) => {
  const form = useForm<z.infer<typeof createDirectoryFormSchema>>({
    resolver: zodResolver(createDirectoryFormSchema),
    defaultValues,
  });

  const { mutate, isPending } = useCreateDirectoryEntry();

  const createDirectoryEntry = (
    data: z.infer<typeof createDirectoryFormSchema>,
  ) =>
    mutate(data, {
      onSuccess: () => {
        toast.success("สร้างรายการไดเรกทอรีสำเร็จ");
        form.reset(defaultValues);
        onClose?.();
      },
      onError: (error) => {
        toast.error(`สร้างรายการล้มเหลว: ${error.message}`);
      },
    });

  return (
    <SheetContent className="w-full sm:w-[480px]">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => createDirectoryEntry(data))}
          className="w-full flex flex-col h-full"
        >
          <SheetHeader>
            <SheetTitle>สร้างรายการไดเรกทอรีใหม่</SheetTitle>
            <SheetDescription>
              กรอกข้อมูลเพื่อสร้างรายการใหม่ในไดเรกทอรี
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 px-4">
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
                      onChange={(value) =>
                        field.onChange(value[0] || undefined)
                      }
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
          </div>

          <SheetFooter>
            <Button type="submit" className="w-full" disabled={isPending}>
              สร้างรายการ{" "}
              {isPending && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
            </Button>
          </SheetFooter>
        </form>
      </Form>
    </SheetContent>
  );
};
