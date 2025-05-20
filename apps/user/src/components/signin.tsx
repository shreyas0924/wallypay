"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import Link from "next/link";

import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import { Label } from "@repo/ui/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { Wallet, Github, Mail, ArrowRight } from "lucide-react";

export function Signin() {
  const router = useRouter();
  const phone = useRef("");
  const password = useRef("");
  const [isLoading, setIsLoading] = useState(false);
  const [requiredError, setRequiredError] = useState({
    phoneReq: false,
    passReq: false,
  });

  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();

    if (!phone.current || !password.current) {
      setRequiredError({
        phoneReq: !phone.current,
        passReq: !password.current,
      });
      return;
    }

    setIsLoading(true);

    const res = await signIn("credentials", {
      phone: phone.current,
      password: password.current,
      redirect: false,
    });

    setIsLoading(false);

    if (!res?.error) {
      router.push("/");
    } else {
      toast("Error signing in", {
        action: {
          label: "Close",
          onClick: () => toast.dismiss(),
        },
      });
    }
  };

  return (
    <Card className="w-full max-w-lg shadow-lg">
      <CardHeader className="space-y-2 text-center">
        <div className="flex justify-center mb-2">
          <div className=" p-3 rounded-full">
            <Wallet className="h-6 w-6" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold">WallyPay</CardTitle>
        <CardDescription>Sign in to access your wallet</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              onChange={(e) => {
                setRequiredError((prev) => ({ ...prev, phoneReq: false }));
                phone.current = e.target.value;
              }}
            />
            {requiredError.phoneReq && (
              <span className="text-red-500 text-sm">Phone is required</span>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              
            </div>
            <Input
              id="password"
              type="password"
              onChange={(e) => {
                setRequiredError((prev) => ({ ...prev, passReq: false }));
                password.current = e.target.value;
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit();
              }}
            />
            {requiredError.passReq && (
              <span className="text-red-500 text-sm">Password is required</span>
            )}
          </div>
         
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign in"}
            {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        </form>




      </CardContent>
    
    </Card>
  );
}
