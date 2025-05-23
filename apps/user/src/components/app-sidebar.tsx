"use client";
import { Separator } from "@repo/ui/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@repo/ui/components/ui/sidebar";
import { ModeToggle } from "@repo/ui/components/theme-toggle";
import { Button } from "@repo/ui/components/ui/button";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import {
  Calendar,
  Home,
  Send,
  Search,
  Settings,
  BanknoteIcon,
  Wallet,
  Loader2,
  LogOut,
  LogIn,
  Moon,
  Sun,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import useHasMounted from "../hooks/useHasMounted";

const items = [
  {
    title: "Home",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Transfer",
    url: "/transfer",
    icon: Send,
  },
  {
    title: "Transactions",
    url: "/transactions",
    icon: Calendar,
  },
  {
    title: "P2P Transfer",
    url: "/p2p",
    icon: Search,
  },
  {
    title: "Bank Accounts",
    url: "/accounts",
    icon: BanknoteIcon,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: Settings,
  },
];

export function AppSidebar() {
  const { data: session, status } = useSession();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const hasMounted = useHasMounted();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleAuthAction = async () => {
    setLoading(true);
    try {
      if (session?.user) {
        await signOut();
        router.push("/api/auth/signin");
      } else {
        await signIn();
      }
    } catch (error) {
      console.error("Auth action failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Wallet />
              {
                <Link href="/" className="text-lg font-medium cursor-pointer">
                  WallyPay
                </Link>
              }
            </div>
          </SidebarGroupLabel>
          <Separator className="my-2" />
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={`${
                      pathname === item.url
                        ? "bg-accent/50 backdrop-blur-sm backdrop-filter"
                        : ""
                    }`}
                  >
                    <Link href={item.url} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      {<span>{item.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Settings and auth group */}
        <SidebarGroup className="mt-auto">
          <Separator className="my-2" />
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={toggleTheme}>
                  <div className="flex items-center gap-2">
                    {hasMounted ? (
                      <>
                        {theme === "dark" ? (
                          <Moon className="h-4 w-4" />
                        ) : (
                          <Sun className="h-4 w-4" />
                        )}
                        {
                          <span>
                            {theme === "dark" ? "Dark" : "Light"} Mode
                          </span>
                        }
                      </>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Sun className="h-4 w-4" />
                        {<span>Light Mode</span>}
                      </div>
                    )}
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={handleAuthAction}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {
                        <span>
                          {session?.user ? "Logging out..." : "Logging in..."}
                        </span>
                      }
                    </>
                  ) : (
                    <>
                      {session?.user ? (
                        <LogOut className="h-4 w-4" />
                      ) : (
                        <LogIn className="h-4 w-4" />
                      )}
                      {<span>{session?.user ? "Logout" : "Login"}</span>}
                    </>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
