"use client";
import { Button } from "@repo/ui/components/ui/button";
import { ModeToggle } from "@repo/ui/components/theme-toggle";
import { signIn, signOut, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { Loader2, Wallet } from "lucide-react";
import { PathnameContext } from "next/dist/shared/lib/hooks-client-context.shared-runtime";

interface AppbarProps {
  user?: {
    name?: string | null;
  };
  onSignin: () => void;
  onSignout: () => void;
  name: string;
  userName?: string | null;
}

export function Appbar({
  user,
  onSignin,
  onSignout,
  name,
  userName,
}: AppbarProps): JSX.Element {
  const [loading, setLoading] = useState(false);

  const handleAuthAction = async () => {
    setLoading(true);
    try {
      if (user) {
        await onSignout();
      } else {
        await onSignin();
      }
    } catch (error) {
      console.error("Auth action failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between align-middle my-4 gap-2">
      <Wallet />
      <Link href="/" className="text-xl font-medium cursor-pointer">
        {name}
      </Link>

      <div className="flex gap-6 ml-auto justify-center items-center align-middle">
        <ModeToggle />
        <div className="flex flex-col justify-center">
          <Button onClick={handleAuthAction} disabled={loading}>
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{user ? "Logging out" : "Logging in"}...</span>
              </div>
            ) : user ? (
              "Logout"
            ) : (
              "Login"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function AppbarClient() {
  const path = usePathname();
  const session = useSession();
  const router = useRouter();

  if (path == "/login") return null;

  return (
    <nav className="border-b border-gray-300">
      <div className="max-w-7xl mx-auto">
        <Appbar
          name="WallyPay"
          onSignin={signIn}
          onSignout={async () => {
            await signOut();
            router.push("/api/auth/signin");
          }}
          user={session.data?.user}
          userName={session.data?.user?.name}
        />
      </div>
    </nav>
  );
}
