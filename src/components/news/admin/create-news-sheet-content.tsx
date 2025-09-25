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
import { Textarea } from "@/components/ui/textarea";
import { createNewsInputSchema } from "@/core/news/schema";
import { useCreateNews } from "@/hooks/news/mutation";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "astro:schema";
import { Loader2 } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const defaultValues = {
  title: "",
  body: "",
};

const createNewsFormSchema = createNewsInputSchema;

export const CreateNewsSheetContent: React.FC<{
  onClose?: () => void;
}> = ({ onClose }) => {
  const form = useForm<z.infer<typeof createNewsFormSchema>>({
    resolver: zodResolver(createNewsFormSchema),
    defaultValues,
  });

  const { mutate, isPending } = useCreateNews();

  const createNews = (data: z.infer<typeof createNewsFormSchema>) =>
    mutate(data, {
      onSuccess: () => {
        toast.success("สร้างข่าวสำเร็จ");
        form.reset(defaultValues);
        onClose?.();
      },
      onError: (error) => {
        toast.error(`สร้างข่าวล้มเหลว: ${error.message}`);
      },
    });

  return (
    <SheetContent className="w-full sm:w-[480px]">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => createNews(data))}
          className="w-full flex flex-col h-full"
        >
          <SheetHeader>
            <SheetTitle>สร้างข่าวใหม่</SheetTitle>
            <SheetDescription>
              กรอกข้อมูลข่าวเพื่อสร้างข่าวใหม่
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 px-4">
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
                  <FormLabel>เนื้อหาข่าว</FormLabel>
                  <FormControl>
                    <Textarea placeholder="เนื้อหาข่าว" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <SheetFooter>
            <Button type="submit" className="w-full" disabled={isPending}>
              สร้างข่าว{" "}
              {isPending && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
            </Button>
          </SheetFooter>
        </form>
      </Form>
    </SheetContent>
  );
};
