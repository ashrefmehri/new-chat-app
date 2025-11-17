"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from 'lucide-react';
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import {useRouter} from "next/navigation";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormValues = z.infer<typeof formSchema>;

export const SignInForm = ({ onSwitchToSignUp }: { onSwitchToSignUp: () => void }) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: FormValues) {
    try {
      setIsLoading(true);
      const result =  await authClient.signIn.email({
        email: values.email,
        password: values.password,
      })
      if (result.error) {
        toast.error(result.error.message || "Oops! Wrong answer — Sign-in failed!")
        return;
      }
  
      // Redirect to dashboard or login
      toast.success("You’re in! 🎉")
      router.push("/conversations")
    } catch (error) {
      console.error("Sign in error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full  h-full tracking-tighter  flex flex-col items-center justify-center">
      <div className="w-full  max-w-md px-6">
        <div className="mb-8">
          <h1 className="font-semibold text-3xl mb-2">
            Welcome back! Let the chatting begin.
          </h1>
          <p className="text-muted-foreground">
            Connect instantly. Seamless group chats, private messages, and media
            sharing. Your friends are waiting!
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                    className="h-10"
                      placeholder="you@example.com"
                      type="email"
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                     className="h-10"
                      placeholder="***********"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 hover:bg-blue-500/90 bg-blue-500"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </Form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <span onClick={onSwitchToSignUp} className="font-semibold text-blue-500 hover:underline">
              Sign up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
