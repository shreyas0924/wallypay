"use client";

import { SidebarTrigger } from "@repo/ui/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { Breadcrumbs } from "./breadcrumbs";
import { Separator } from "@repo/ui/components/ui/separator";

export function Navbar() {
  const pathname = usePathname();

  // Convert pathname to breadcrumb items
  const getBreadcrumbs = () => {
    const paths = pathname.split("/").filter(Boolean);
    return paths.map((path, index) => ({
      title: path.charAt(0).toUpperCase() + path.slice(1),
      href: "/" + paths.slice(0, index + 1).join("/"),
    }));
  };

  return (
    <nav className="sticky w-full top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-12 items-center gap-4 px-4 w-full">
        <SidebarTrigger />
        <div className="flex flex-1">
          {/* <Breadcrumbs
            items={getBreadcrumbs()}
            separator={<ChevronRight className="h-4 w-4" />}
          /> */}
        </div>
      </div>
    </nav>
  );
}
