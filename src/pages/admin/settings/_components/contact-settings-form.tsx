import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Loader } from "@/components/common/loader";
import { LoaderButton } from "@/components/common/loader-button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { useUpdateGlobalSettings } from "@/hooks/config/mutations";
import { useGetGlobalSettings } from "@/hooks/config/queries";

const contactFormSchema = z.object({
  addressTh: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  mapEmbed: z.string().optional(),
  facebookOfficial: z.string().optional(),
  facebookNews: z.string().optional(),
  tiktok: z.string().optional(),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactSettingsForm() {
  const { data: config, isPending: isLoading } = useGetGlobalSettings();
  const { mutate, isPending } = useUpdateGlobalSettings();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      addressTh: "",
      phone: "",
      email: "",
      mapEmbed: "",
      facebookOfficial: "",
      facebookNews: "",
      tiktok: "",
    },
  });

  useEffect(() => {
    if (config) {
      form.reset({
        addressTh: config.addressTh || "",
        phone: config.phone || "",
        email: config.email || "",
        mapEmbed: config.mapEmbed || "",
        facebookOfficial: config.facebookOfficial || "",
        facebookNews: config.facebookNews || "",
        tiktok: config.tiktok || "",
      });
    }
  }, [config, form]);

  const onSubmit = form.handleSubmit((values) => {
    mutate(values, {
      onSuccess: () => {
        toast.success("อัปเดตข้อมูลติดต่อสำเร็จ");
      },
      onError: () => {
        toast.error("ไม่สามารถอัปเดตข้อมูลติดต่อได้");
      },
    });
  });

  if (isLoading) return <Loader />;

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-6">
        <FormField
          control={form.control}
          name="addressTh"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ที่อยู่ (ภาษาไทย)</FormLabel>
              <FormControl>
                <Textarea placeholder="ป้อนที่อยู่" {...field} />
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
              <FormLabel>เบอร์โทรศัพท์</FormLabel>
              <FormControl>
                <Input placeholder="ป้อนเบอร์โทรศัพท์" {...field} />
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
                <Input type="email" placeholder="ป้อนอีเมล" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="mapEmbed"
          render={({ field }) => (
            <FormItem>
              <FormLabel>แผนที่ฝัง (Embed Code)</FormLabel>
              <FormControl>
                <Textarea placeholder="ป้อนโค้ดแผนที่ฝัง" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="facebookOfficial"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Facebook ทางการ</FormLabel>
              <FormControl>
                <Input placeholder="ป้อนลิงก์ Facebook ทางการ" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="facebookNews"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Facebook ข่าว</FormLabel>
              <FormControl>
                <Input placeholder="ป้อนลิงก์ Facebook ข่าว" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tiktok"
          render={({ field }) => (
            <FormItem>
              <FormLabel>TikTok</FormLabel>
              <FormControl>
                <Input placeholder="ป้อนลิงก์ TikTok" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <LoaderButton type="submit" isLoading={isPending}>
          บันทึกข้อมูลติดต่อ
        </LoaderButton>
      </form>
    </Form>
  );
}
