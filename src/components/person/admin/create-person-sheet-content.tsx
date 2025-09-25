import { Button } from "@/components/ui/button";
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
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { createPersonInputSchema } from "@/core/person/schema";
import { THAI_ARMY_RANKS } from "@/core/shared/constants";
import { useCreatePerson } from "@/hooks/person/mutation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "astro:schema";
import { Loader2 } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const defaultValues = {
  name: "",
  rank: "",
  role: "",
  bio: "",
  order: 0,
  level: 0,
};

const createPersonFormSchema = createPersonInputSchema;

export const CreatePersonSheetContent: React.FC<{
  onClose?: () => void;
}> = ({ onClose }) => {
  const form = useForm<z.infer<typeof createPersonFormSchema>>({
    resolver: zodResolver(createPersonFormSchema),
    defaultValues,
  });

  const { mutate, isPending } = useCreatePerson();

  const createPerson = (data: z.infer<typeof createPersonFormSchema>) =>
    mutate(data, {
      onSuccess: () => {
        toast.success("สร้างบุคคลสำเร็จ");
        form.reset(defaultValues);
        onClose?.();
      },
      onError: (error) => {
        toast.error(`สร้างบุคคลล้มเหลว: ${error.message}`);
      },
    });

  return (
    <SheetContent className="w-full sm:w-[480px]">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => createPerson(data))}
          className="w-full flex flex-col h-full"
        >
          <SheetHeader>
            <SheetTitle>สร้างบุคคลใหม่</SheetTitle>
            <SheetDescription>
              กรอกข้อมูลบุคคลเพื่อสร้างบุคคลใหม่
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 px-4">
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
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
          </div>

          <SheetFooter>
            <Button type="submit" className="w-full" disabled={isPending}>
              สร้างบุคคล{" "}
              {isPending && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
            </Button>
          </SheetFooter>
        </form>
      </Form>
    </SheetContent>
  );
};
