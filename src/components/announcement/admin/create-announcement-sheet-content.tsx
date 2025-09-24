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
import { createAnnouncementInputSchema } from "@/core/announcement/schema";
import { useCreateAnnouncement } from "@/hooks/announcement/mutation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "astro:schema";
import { Loader2 } from "lucide-react";
import React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { TagsFormField } from "./form/tags-form-field";
const defaultValues = {
  title: "",
  body: "",
  tags: [],
};

const createAnnouncementFormSchema = createAnnouncementInputSchema
  .omit({
    tags: true,
  })
  .extend({
    tags: z
      .array(
        z.object({
          tag: createAnnouncementInputSchema.shape.tags
            .innerType()
            .unwrap()
            .unwrap().element,
        }),
      )
      .optional()
      .nullable(),
  });

export const CreateAnnouncementSheetContent: React.FC<{
  onClose?: () => void;
}> = ({ onClose }) => {
  const form = useForm<z.infer<typeof createAnnouncementFormSchema>>({
    resolver: zodResolver(createAnnouncementFormSchema),
    defaultValues,
  });

  const tags = useFieldArray({ control: form.control, name: "tags" });

  const { mutate, isPending } = useCreateAnnouncement();

  const createAnnouncement = (
    data: z.infer<typeof createAnnouncementFormSchema>,
  ) =>
    mutate(
      {
        ...data,
        tags: data.tags?.map((t) => t.tag) || [],
      },
      {
        onSuccess: () => {
          toast.success("สร้างประกาศสำเร็จ");
          form.reset(defaultValues);
          onClose?.();
        },
        onError: (error) => {
          toast.error(`สร้างประกาศล้มเหลว: ${error.message}`);
        },
      },
    );

  return (
    <SheetContent className="w-full sm:w-[480px]">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => createAnnouncement(data))}
          className="w-full flex flex-col h-full"
        >
          <SheetHeader>
            <SheetTitle>สร้างประกาศใหม่</SheetTitle>
            <SheetDescription>
              กรอกข้อมูลประกาศเพื่อสร้างประกาศใหม่
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
                  <FormLabel>เนื้อหาประกาศ</FormLabel>
                  <FormControl>
                    <Textarea placeholder="เนื้อหาประกาศ" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <TagsFormField
              tags={tags.fields}
              onRemove={(idx) => tags.remove(idx)}
              onAdd={(tag) => tags.append({ tag })}
            />
          </div>

          <SheetFooter>
            <Button type="submit" className="w-full" disabled={isPending}>
              สร้างประกาศ{" "}
              {isPending && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
            </Button>
          </SheetFooter>
        </form>
      </Form>
    </SheetContent>
  );
};
