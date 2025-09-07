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
import { signIn, signUp } from "@/lib/auth/client";
import React from "react";
import { navigate } from "astro:transitions/client";
import { Alert } from "@/components/ui/alert";
import { z } from "astro:schema";

export const signupSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8),
});

export const SignupForm = () => {
  const form = useForm({
    resolver: zodResolver(signupSchema),
  });

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = form.handleSubmit((data) => {
    signUp.email(
      {
        name: data.name,
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
          <span>{error}</span>
        </Alert>
      )}
      <Form {...form}>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <FormField
            name="name"
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
            สมัครสมาชิก
          </Button>
          <a href="/signin" className="text-sm text-muted-foreground underline">
            มีบัญชีอยู่แล้ว? เข้าสู่ระบบ
          </a>
        </form>
      </Form>
    </div>
  );
};
