"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { rootNavigationItems } from "@/constants/navigation";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { LogOutIcon } from "lucide-react";
import { useState } from "react";

import { deleteCookie } from "@/lib/cookies";
import { useRouter } from "next/navigation";
import { AUTH_COOKIE_NAME } from "@/lib/cookies";
import { Spinner } from "../ui/spinner";
import { toast } from "sonner";
import { logout } from "@/features/auth/api";

const AppSidebar = () => {
  const pathname = usePathname();
  const [isLogout, setIsLogout] = useState(false);
  const router = useRouter();

  // Handle logout functionality
  const handelLogout = async () => {
    setIsLogout(true);

    try {
      await logout();
      toast.success("Logged out successfully.");
    } catch {
      toast.error("Server logout failed. Local session was cleared.");
    } finally {
      deleteCookie(AUTH_COOKIE_NAME);
      router.replace("/sign-in");
      router.refresh();
      setIsLogout(false);
    }
  };

  return (
    <aside className="hidden min-h-svh w-64 shrink-0 border-r bg-card text-card-foreground md:flex md:flex-col">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/users" className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-md bg-primary font-semibold text-primary-foreground">
            LF
          </span>
          <div className="flex flex-col leading-tight">
            <span className="font-semibold">LoanFlow</span>
            <span className="text-muted-foreground text-xs">Admin panel</span>
          </div>
        </Link>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-3">
        {rootNavigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                isActive &&
                "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className=" p-3">
        <Button
          variant="outline"
          size="sm"
          className=" mb-3 m-auto  w-full "
          onClick={handelLogout}
          disabled={isLogout}
        >
          {isLogout ? (
            <>
              <Spinner />
              Logging out...
            </>
          ) : (
            <>
              <LogOutIcon className="size-4" />
              Log out
            </>
          )}
        </Button>
      </div>
    </aside>
  );
}


export { AppSidebar };
