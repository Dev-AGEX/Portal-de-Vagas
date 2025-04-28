import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import ClientSideLayout from "./client-side-layout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PORTAL DE VAGAS",
  description: "Sistema de gerenciamento de vagas e candidatos",
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" }
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={cn(inter.className, "antialiased")} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClientSideLayout>{children}</ClientSideLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
