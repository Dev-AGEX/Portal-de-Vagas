"use client";

import { Sidebar } from "@/components/sidebar";
import { ClientLayout } from "@/components/client-layout";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export default function ClientSideLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/auth";

  return (
    <div className="flex">
      {!isAuthPage && <Sidebar />}
      <main className={cn("flex-1", !isAuthPage && "ml-[256px]")}>
        <ClientLayout>{children}</ClientLayout>
      </main>
    </div>
  );
}