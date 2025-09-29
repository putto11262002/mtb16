import { toast } from "sonner";

import { Loader } from "@/components/common/loader";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Config } from "@/config";

import {
  useUpdateGlobalSettings,
  useUpdatePopupImage,
} from "@/hooks/config/mutations";
import { useGetGlobalSettings } from "@/hooks/config/queries";

export default function PopupSettingsForm() {
  const { data: config, isPending: isLoading } = useGetGlobalSettings();
  const { mutate: mutateConfig, isPending: isConfigPending } =
    useUpdateGlobalSettings();
  const { mutate: mutateImage, isPending: isImagePending } =
    useUpdatePopupImage();

  const handlePopupEnabledChange = (enabled: boolean) => {
    mutateConfig(
      { popupEnabled: enabled },
      {
        onSuccess: () => {
          toast.success("อัปเดตการตั้งค่าป๊อปอัพสำเร็จ");
        },
        onError: () => {
          toast.error("ไม่สามารถอัปเดตการตั้งค่าป๊อปอัพได้");
        },
      },
    );
  };

  const handleImageChange = (file: File | undefined) => {
    if (file) {
      mutateImage(
        { popupImage: file },
        {
          onSuccess: () => {
            toast.success("อัปเดตรูปภาพป๊อปอัพสำเร็จ");
          },
          onError: () => {
            toast.error("ไม่สามารถอัปเดตรูปภาพป๊อปอัพได้");
          },
        },
      );
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="space-y-6">
      <div className="flex flex-row items-center justify-between rounded-lg border p-4">
        <div className="space-y-0.5">
          <label className="text-base font-medium">เปิดใช้งานป๊อปอัพ</label>
          <p className="text-sm text-muted-foreground">
            แสดงป๊อปอัพเมื่อเข้าหน้าแรก
          </p>
        </div>
        <Switch
          checked={config?.popupEnabled || false}
          onCheckedChange={handlePopupEnabledChange}
          disabled={isConfigPending}
        />
      </div>

      <div>
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          รูปภาพป๊อปอัพ
        </label>
        <AspectRatio
          ratio={16 / 9}
          className="w-full rounded-md overflow-hidden bg-muted mt-2"
        >
          {config?.popupImage && (
            <img
              src={Config.getFileURL(config.popupImage.id)}
              alt="Popup Image"
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
      </div>
    </div>
  );
}
