import { toast } from "sonner";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Input } from "@/components/ui/input";
import { Config } from "@/config";

import { useUpdateAboutUsHeroImage } from "@/hooks/config/mutations";
import { useGetGlobalSettings } from "@/hooks/config/queries";

export default function AboutUsHeroSettingsForm() {
  const { data: config, isPending: isLoading } = useGetGlobalSettings();
  const { mutate: mutateImage, isPending: isImagePending } =
    useUpdateAboutUsHeroImage();

  const handleImageChange = (file: File | undefined) => {
    if (file) {
      mutateImage(
        { aboutUsHeroImage: file },
        {
          onSuccess: () => {
            toast.success("อัปเดตรูปภาพหน้าว่าด้วยเรา สำเร็จ");
          },
          onError: () => {
            toast.error("ไม่สามารถอัปเดตรูปภาพหน้าว่าด้วยเราได้");
          },
        },
      );
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          รูปภาพหน้าว่าด้วยเรา
        </label>
        <AspectRatio
          ratio={16 / 9}
          className="w-full rounded-md overflow-hidden bg-muted mt-2"
        >
          {config?.aboutUsHeroImage && (
            <img
              src={Config.getFileURL(config.aboutUsHeroImage.id)}
              alt="About Us Hero Image"
              className="object-cover w-full h-full"
            />
          )}
        </AspectRatio>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageChange(e.target.files?.[0])}
          disabled={isImagePending}
          className="mt-2"
        />
        {isImagePending && (
          <p className="text-sm text-muted-foreground mt-1">กำลังอัปโหลด...</p>
        )}
      </div>
    </div>
  );
}
