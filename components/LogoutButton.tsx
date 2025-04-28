"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function LogoutButton({ isCollapsed }: { isCollapsed?: boolean }) {
  const router = useRouter();

  const handleLogout = () => {
    // You might want to add logout logic here, such as:
    // - Clearing local storage/cookies
    // - Calling a logout API endpoint
    
    // Redirect to authentication page
    router.push("/auth");
  };

  return (
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start",
        isCollapsed && "justify-center"
      )}
      onClick={handleLogout}
    >
      <LogOut className="h-4 w-4 mr-2" />
      {!isCollapsed && "Sair"}
    </Button>
  );
}