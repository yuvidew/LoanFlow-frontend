"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ModeToggle } from "@/components/common/mode-toggle";
import { Separator } from "@/components/ui/separator";
import { rootNavigationItems } from "@/constants/navigation";
import { cn } from "@/lib/utils";

function AppHeader() {
  const pathname = usePathname();
  const activeItem = rootNavigationItems.find((item) => item.href === pathname);

  return (
    <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <div className="flex h-16 items-center justify-between gap-4 px-4 md:px-6">
        <div className="min-w-0">
          <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
            LoanFlow Admin
          </p>
          <h1 className="truncate font-semibold text-lg">
            {activeItem?.label ?? "Users"}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <nav className="hidden items-center gap-1 sm:flex md:hidden">
            {rootNavigationItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground",
                    isActive && "bg-muted text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <Separator orientation="vertical" className="hidden h-6 sm:block" />
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}

export { AppHeader };
