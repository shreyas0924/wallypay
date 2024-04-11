"use client";
import { Button } from "@repo/ui/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

export const SidebarItem = ({
  href,
  title,
  icon,
}: {
  href: string;
  title: string;
  icon: React.ReactNode;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const selected = pathname === href;

  return (
    <div
      className={`flex px-3 w-[75%] rounded-2xl mb-3 ${selected ? "dark:text-gray-800 text-gray-800 bg-gray-300" : "text-slate-500"} cursor-pointer  py-2`}
      onClick={() => {
        router.push(href);
      }}
    >
      <div className="pr-2">{icon}</div>
      <div
        className={`font-bold ${selected ? "dark:text-gray-800 text-gray-800" : "text-slate-500"}`}
      >
        {title}
      </div>
    </div>
  );
};
