import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { signIn } from "@/lib/auth/client";
import React from "react";
import { navigate } from "astro:transitions/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { z } from "astro:schema";

const signinSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const SigninForm = () => {
  const form = useForm({
    resolver: zodResolver(signinSchema),
  });

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = form.handleSubmit((data) => {
    signIn.email(
      {
        email: data.email,
        password: data.password,
      },
      {
        onRequest: () => {
          setLoading(true);
          setError(null);
        },
        onError: (error) => {
          setLoading(false);
          setError(error.error.message);
        },
        onSuccess: (data) => {
          setLoading(false);
          setError(null);
          navigate("/secure");
        },
      },
    );
  });

  return (
    <div>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>เกิดข้อผิดพลาด</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Form {...form}>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <FormField
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>อีเมล</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>รหัสผ่าน</FormLabel>
                <FormControl>
                  <Input {...field} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={loading} type="submit">
            เข้าสู่ระบบ
          </Button>
          <a href="/signup" className="text-sm text-muted-foreground underline">
            ยังไม่มีบัญชี? สมัครสมาชิก
          </a>
        </form>
      </Form>
    </div>
  );
};
