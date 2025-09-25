// External libraries
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "astro:schema";
import { memo, useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

// Internal components
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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  updatePersonInputSchema,
  updatePortraitInputSchema,
} from "@/core/person/schema";
import { THAI_ARMY_RANKS } from "@/core/shared/constants";
import type { Person } from "@/db/schema";

// Hooks
import { Loader } from "@/components/common/loader";
import { ErrorAlert } from "@/components/ui/error-alert";
import {
  useUpdatePerson,
  useUpdatePersonPortrait,
} from "@/hooks/person/mutation";
import { useGetPerson } from "@/hooks/person/queries";

export const EditPersonSheetContent: React.FC<{
  onClose: () => void;
  id: string | undefined;
}> = ({ onClose, id }) => {
  const { data: person, isPending, error } = useGetPerson({ id });
  return (
    <SheetContent className="w-full sm:w-[540px] lg:w-[700px] xl:w-[900px] overflow-hidden">
      <SheetHeader>
        <SheetTitle>แก้ไขบุคคล</SheetTitle>
        <SheetDescription>แก้ไขรายละเอียดบุคคล</SheetDescription>
      </SheetHeader>
      <ScrollArea className="px-4 pb-8 overflow-y-auto">
        <div className="space-y-6">
          {error ? (
            <ErrorAlert>Error loading person: {error.message}</ErrorAlert>
          ) : isPending || !person ? (
            <Loader />
          ) : (
            <>
              <MetadataForm initialData={person} />
              <Separator />
              <PortraitForm
                portraitUrl={
                  person?.portrait
                    ? Config.getFileURL(person?.portrait)
                    : undefined
                }
                id={person.id}
              />
            </>
          )}
        </div>
      </ScrollArea>
    </SheetContent>
  );
};

const updatePersonFormSchema = updatePersonInputSchema.omit({ id: true });

// Form component for updating person metadata
const MetadataForm = memo(({ initialData }: { initialData: Person }) => {
  const form = useForm({
    resolver: zodResolver(updatePersonFormSchema),
    defaultValues: {
      name: initialData.name,
      rank: initialData.rank || "",
      role: initialData.role || "",
      bio: initialData.bio || "",
      order: initialData.order || 0,
      level: initialData.level || 0,
    },
  });

  const { mutate, isPending } = useUpdatePerson();

  // Handler for form submission, memoized to prevent recreation
  const handleSubmit = useCallback(
    (data: z.infer<typeof updatePersonFormSchema>) => {
      mutate(
        { ...data, id: initialData.id },
        {
          onSuccess: () => {
            toast.success("แก้ไขบุคคลสำเร็จ");
          },
          onError: () => {
            toast.error("แก้ไขบุคคลไม่สำเร็จ");
          },
        },
      );
    },
    [mutate, initialData.id],
  );

  return (
    <Form {...form}>
      <form className="grid gap-4" onSubmit={form.handleSubmit(handleSubmit)}>
        {/* Basic Information */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ชื่อ</FormLabel>
              <FormControl>
                <Input placeholder="ชื่อบุคคล" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="rank"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ยศ</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="เลือกยศ" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.keys(THAI_ARMY_RANKS).map((rank) => (
                    <SelectItem key={rank} value={rank}>
                      {rank}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ตำแหน่ง</FormLabel>
              <FormControl>
                <Input placeholder="ตำแหน่ง" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ชีวประวัติ</FormLabel>
              <FormControl>
                <Textarea placeholder="ชีวประวัติ" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator />

        {/* Organizational Details */}
        <FormField
          control={form.control}
          name="level"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ระดับ</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="ระดับ"
                  {...field}
                  onChange={(e) =>
                    field.onChange(parseInt(e.target.value) || 0)
                  }
                />
              </FormControl>
              <FormDescription>
                ระดับในโครงสร้างองค์กร (0 = ราก)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="order"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ลำดับ</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="ลำดับ"
                  {...field}
                  onChange={(e) =>
                    field.onChange(parseInt(e.target.value) || 0)
                  }
                />
              </FormControl>
              <FormDescription>
                ลำดับการจัดเรียงภายในระดับเดียวกัน (ตัวเลขน้อยแสดงก่อน)
              </FormDescription>
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

const portraitFormSchema = updatePortraitInputSchema.omit({ id: true });

// Form component for updating person portrait
const PortraitForm = memo(
  ({ portraitUrl, id }: { portraitUrl?: string; id: string }) => {
    const form = useForm({
      resolver: zodResolver(portraitFormSchema),
    });
    const { mutate, isPending } = useUpdatePersonPortrait();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Handler for updating portrait, memoized to prevent recreation
    const update = useCallback(
      (data: z.infer<typeof portraitFormSchema>) =>
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
          ratio={1}
          className="w-full p-0 rounded-md bg-muted overflow-hidden"
        >
          {portraitUrl && (
            <img
              src={portraitUrl}
              alt="Portrait"
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
                      accept="image/*"
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
