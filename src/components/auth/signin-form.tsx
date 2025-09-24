import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { signIn } from "@/lib/auth/client";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "astro:schema";
import { navigate } from "astro:transitions/client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ErrorAlert } from "../ui/error-alert";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { LoaderButton } from "../common/loader-button";

const SignInFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "จำเป็นต้องใส่รหัสผ่าน"),
});

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm({
    resolver: zodResolver(SignInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof SignInFormSchema>) => {
    setIsLoading(true);
    setError(null);
    
    signIn.email(
      { email: data.email, password: data.password },
      {
        onError: (err) => {
          setError(err.error.message);
          setIsLoading(false);
        },
        onSuccess: (_) => {
          setError(null);
          navigate("/admin");
          setIsLoading(false);
        },
      },
    );
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>เข้าสู่ระบบบัญชีของคุณ</CardTitle>
          <CardDescription>
            กรอกอีเมลของคุณด้านล่างเพื่อเข้าสู่ระบบบัญชีของคุณ
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && <ErrorAlert>{error}</ErrorAlert>}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-6"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>อีเมล</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="m@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center">
                      <FormLabel>รหัสผ่าน</FormLabel>
                      <a
                        href="#"
                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                      >
                        ลืมรหัสผ่านของคุณ?
                      </a>
                    </div>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col gap-3">
                <LoaderButton type="submit" className="w-full" isLoading={isLoading}>
                  เข้าสู่ระบบ
                </LoaderButton>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
