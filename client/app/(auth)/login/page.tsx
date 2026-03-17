"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "@/graphql/mutations";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const [login, { loading }] = useMutation(LOGIN_USER, {
    onCompleted: (data: {
      loginUser: { token: string; user: { id: string; name: string; role: string } };
    }) => {
      localStorage.setItem("token", data.loginUser.token);
      localStorage.setItem("user", JSON.stringify(data.loginUser.user));
      toast.success("Logged in successfully!");
      if (data.loginUser.user.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/dashboard");
      }
    },
    onError: (error: { message: string }) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ variables: { email, password } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-bold text-2xl text-white"
          >
            <Sparkles className="text-blue-500" />
            AI Career Portal
          </Link>
        </div>

        <Card className="border-white/10 bg-slate-900 text-white">
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription className="text-slate-400">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="name@example.com"
                  className="bg-slate-800 border-white/10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <Input
                  id="login-password"
                  type="password"
                  className="bg-slate-800 border-white/10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Login"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <div className="text-sm text-slate-400">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-blue-400 hover:underline">
                Register
              </Link>
            </div>
            <div className="text-xs text-slate-500 bg-blue-500/5 p-3 rounded-lg border border-blue-500/10 w-full">
              <p className="font-semibold text-blue-400/80 mb-1">
                Demo Credentials:
              </p>
              <p>Admin: admin@example.com / admin123</p>
              <p>User: user@example.com / user123</p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
