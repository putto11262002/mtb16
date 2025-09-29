import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { LoaderButton } from "@/components/common/loader-button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { TagField } from "@/components/ui/tag-field";

import { useUpdateGlobalSettings } from "@/hooks/config/mutations";
import { useGetGlobalSettings } from "@/hooks/config/queries";
import { useEffect } from "react";

const landingPageFormSchema = z.object({
  newsTag: z.string().trim().optional(),
  announcementsTag: z.string().trim().optional(),
});

type LandingPageFormValues = z.infer<typeof landingPageFormSchema>;

export default function LandingPageSettingsForm() {
  const { data: config, isPending: isLoading } = useGetGlobalSettings();
  const { mutate, isPending } = useUpdateGlobalSettings();

  const form = useForm<LandingPageFormValues>({
    resolver: zodResolver(landingPageFormSchema),
    defaultValues: {
      newsTag: "",
      announcementsTag: "",
    },
  });

  useEffect(() => {
    if (config) {
      form.reset({
        newsTag: config.newsTag || "",
        announcementsTag: config.announcementsTag || "",
      });
    }
  }, [config, form]);

  const onSubmit = form.handleSubmit((values) => {
    mutate(values, {
      onSuccess: () => {
        toast.success("อัปเดตแท็กหน้าแรกสำเร็จ");
      },
      onError: () => {
        toast.error("ไม่สามารถอัปเดตแท็กหน้าแรกได้");
      },
    });
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-6">
        <FormField
          control={form.control}
          name="newsTag"
          render={({ field }) => (
            <FormItem>
              <FormLabel>แท็กข่าว</FormLabel>
              <FormControl>
                <TagField
                  type="news"
                  value={field.value ? [field.value] : []}
                  onChange={(tags: string[]) => field.onChange(tags[0] || "")}
                  multiple={false}
                  placeholder="เลือกหรือสร้างแท็กข่าว..."
                />
              </FormControl>
              <FormMessage />
              <FormDescription>
                ข่าวที่มีแท็กนี้จะถูกแสดงเป็นลำดับแรกในหน้าแรก
              </FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="announcementsTag"
          render={({ field }) => (
            <FormItem>
              <FormLabel>แท็กประกาศ</FormLabel>
              <FormControl>
                <TagField
                  type="announcement"
                  value={field.value ? [field.value] : []}
                  onChange={(tags: string[]) => field.onChange(tags[0] || "")}
                  multiple={false}
                  placeholder="เลือกหรือสร้างแท็กประกาศ..."
                />
              </FormControl>
              <FormMessage />
              <FormDescription>
                ประกาศที่มีแท็กนี้จะถูกแสดงเป็นลำดับแรกในหน้าแรก
              </FormDescription>
            </FormItem>
          )}
        />

        <LoaderButton type="submit" isLoading={isPending}>
          บันทึกแท็กหน้าแรก
        </LoaderButton>
      </form>
    </Form>
  );
}
