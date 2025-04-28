"use client";

import { Sidebar } from "@/components/sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { ClientLayout } from "@/components/client-layout";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export default function RootClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/auth";

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="flex">
        {!isAuthPage && <Sidebar />}
        <main className={cn("flex-1", !isAuthPage && "ml-[256px]")}>
          <ClientLayout>{children}</ClientLayout>
        </main>
      </div>
    </ThemeProvider>
  );
}