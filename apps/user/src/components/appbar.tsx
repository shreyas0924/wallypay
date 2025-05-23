"use client";
import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@repo/ui/components/ui/sidebar";

export function Appbar() {
  return (
    <div className="flex items-center justify-between align-middle my-4 gap-2">
      <SidebarTrigger />
    </div>
  );
}

export function AppbarClient() {
  const path = usePathname();

  if (path === "/login") return null;

  return (
    <nav className="border-b border-gray-300">
      <div className="max-w-7xl mx-auto">
        <Appbar />
      </div>
    </nav>
  );
}
