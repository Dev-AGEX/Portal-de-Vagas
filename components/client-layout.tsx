"use client";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/auth";

  return (
    <div className="flex min-h-screen">
      <main className={cn("flex-1", isAuthPage && "w-full")}>
        {children}
      </main>
    </div>
  );
}