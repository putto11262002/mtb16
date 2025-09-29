import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { LoaderButton } from "@/components/common/loader-button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { TagField } from "@/components/ui/tag-field";
import { Config } from "@/config";

import {
  useUpdateLandingPageConfig,
  useUpdateLandingPageHeroImage,
  useUpdateLandingPagePopupImage,
} from "@/hooks/config/mutations";
import { useGetLandingPageConfig } from "@/hooks/config/queries";
import { useEffect } from "react";

const landingPageFormSchema = z.object({
  heroTitle: z.string().trim().max(255),
  heroImage: z.instanceof(File).optional(),
  newsTag: z.string().trim().optional(),
  announcementsTag: z.string().trim().optional(),
  popupEnabled: z.boolean(),
  popupImage: z.instanceof(File).optional(),
});

type LandingPageFormValues = z.infer<typeof landingPageFormSchema>;

export default function LandingPageForm() {
  const { data: config, isPending: isLoading } = useGetLandingPageConfig();
  const { mutate: mutateConfig, isPending: isConfigPending } =
    useUpdateLandingPageConfig();
  const { mutate: mutateImage, isPending: isImagePending } =
    useUpdateLandingPageHeroImage();
  const { mutate: mutatePopupImage, isPending: isPopupImagePending } =
    useUpdateLandingPagePopupImage();

  const form = useForm<LandingPageFormValues>({
    resolver: zodResolver(landingPageFormSchema),
    defaultValues: {
      heroTitle: "",
      newsTag: "",
      announcementsTag: "",
      popupEnabled: false,
    },
  });

  useEffect(() => {
    if (config) {
      form.reset({
        heroTitle: config.heroTitle || "",
        newsTag: config.newsTag || "",
        announcementsTag: config.announcementsTag || "",
        popupEnabled: config.popupEnabled || false,
      });
    }
  }, [config]);

  const onSubmit = form.handleSubmit((values) => {
    const { heroImage, popupImage, ...configValues } = values;

    // Update config data first
    mutateConfig(configValues, {
      onSuccess: () => {
        let imageUpdates = 0;
        const totalImages = (heroImage ? 1 : 0) + (popupImage ? 1 : 0);

        const onImageSuccess = () => {
          imageUpdates++;
          if (imageUpdates === totalImages) {
            toast.success("อัปเดตการตั้งค่าหน้าแรกสำเร็จ");
          }
        };

        const onImageError = (type: string) => {
          toast.error(
            `ไม่สามารถอัปเดตภาพ${type === "hero" ? "หลัก" : "ป๊อปอัพ"}ได้`,
          );
        };

        // If there's a hero image, update it
        if (heroImage) {
          mutateImage(
            { heroImage },
            {
              onSuccess: onImageSuccess,
              onError: () => onImageError("hero"),
            },
          );
        }

        // If there's a popup image, update it
        if (popupImage) {
          mutatePopupImage(
            { popupImage },
            {
              onSuccess: onImageSuccess,
              onError: () => onImageError("popup"),
            },
          );
        }

        if (totalImages === 0) {
          toast.success("อัปเดตการตั้งค่าหน้าแรกสำเร็จ");
        }
      },
      onError: () => {
        toast.error("ไม่สามารถอัปเดตการตั้งค่าหน้าแรกได้");
      },
    });
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-6">
        <FormField
          control={form.control}
          name="heroTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>หัวข้อหลัก</FormLabel>
              <FormControl>
                <Input placeholder="ป้อนหัวข้อหลัก" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="heroImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>รูปภาพหลัก</FormLabel>
              <AspectRatio
                ratio={16 / 9}
                className="w-full rounded-md overflow-hidden bg-muted"
              >
                {config?.heroImage && (
                  <img
                    src={Config.getFileURL(config.heroImage.id)}
                    alt="Hero Image"
                    className="object-cover w-full h-full"
                  />
                )}
              </AspectRatio>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => field.onChange(e.target.files?.[0])}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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

        <FormField
          control={form.control}
          name="popupEnabled"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">เปิดใช้งานป๊อปอัพ</FormLabel>
                <FormDescription>แสดงป๊อปอัพเมื่อเข้าหน้าแรก</FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="popupImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>รูปภาพป๊อปอัพ</FormLabel>
              <AspectRatio
                ratio={16 / 9}
                className="w-full rounded-md overflow-hidden bg-muted"
              >
                {config?.popupImage && (
                  <img
                    src={Config.getFileURL(config.popupImage.id)}
                    alt="Popup Image"
                    className="object-cover w-full h-full"
                  />
                )}
              </AspectRatio>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => field.onChange(e.target.files?.[0])}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <LoaderButton
          type="submit"
          isLoading={isConfigPending || isImagePending || isPopupImagePending}
        >
          บันทึก
        </LoaderButton>
      </form>
    </Form>
  );
}
