"use client";
import { Button } from "@repo/ui/components/ui/button";
import { toast } from "sonner";
import { Label } from "@repo/ui/components/ui/label";
import { Input } from "@repo/ui/components/ui/input";
import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { signIn } from "next-auth/react";
export function Signin() {
  const router = useRouter();
  const phone = useRef("");
  const password = useRef("");
  const [requiredError, setRequiredError] = useState({
    phoneReq: false,
    passReq: false,
  });
  const handleSubmit = async (e?: React.FormEvent<HTMLButtonElement>) => {
    if (e) {
      e.preventDefault();
    }

    if (!phone.current || !password.current) {
      setRequiredError({
        phoneReq: phone.current ? false : true,
        passReq: password.current ? false : true,
      });
      return;
    }

    const res = await signIn("credentials", {
      phone: phone.current,
      password: password.current,
      redirect: false,
    });

    if (!res?.error) {
      router.push("/");
    } else {
      toast("Error Signing in", {
        action: {
          label: "Close",
          onClick: () => toast.dismiss(),
        },
      });
    }
  };
  return (
    <Card className="mx-auto mt-4 h-full my-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">Sign Up</CardTitle>
        <CardDescription>
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              name="phone"
              id="phone"
              placeholder="1111111111"
              onChange={(e) => {
                setRequiredError((prevState) => ({
                  ...prevState,
                  phoneReq: false,
                }));
                phone.current = e.target.value;
              }}
            />
            {requiredError.phoneReq && (
              <span className="text-red-500">Phone is required</span>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              className="border-0"
              name="password"
              type={"password"}
              id="password"
              placeholder="••••••••"
              onChange={(e) => {
                setRequiredError((prevState) => ({
                  ...prevState,
                  passReq: false,
                }));
                password.current = e.target.value;
              }}
              onKeyDown={async (e) => {
                if (e.key === "Enter") {
                  handleSubmit();
                }
              }}
            />
          </div>
          <Button type="submit" className="w-full" onClick={handleSubmit}>
            Sign In
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
