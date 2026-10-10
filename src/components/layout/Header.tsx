"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, LogOut, Sun, Moon, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/contexts/ThemeContext";
import { NAVIGATION } from "@/lib/constants";
import { isOperatorUser } from "@/lib/auth/access";

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { user, logOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  const navLinks = NAVIGATION.filter((item) => item.audience === "public" || isOperatorUser(user)).map((item) => {
    const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
    return (
      <Link
        key={item.href}
        href={item.href}
        aria-current={active ? "page" : undefined}
        className={cn(
          "relative flex min-h-11 items-center text-sm font-semibold transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:origin-left after:rounded-full after:bg-primary after:transition-transform after:duration-300",
          active
            ? "text-foreground after:scale-x-100"
            : "text-muted-foreground after:scale-x-0 hover:text-foreground hover:after:scale-x-100"
        )}
        onClick={() => setOpen(false)}
      >
        {item.label}
      </Link>
    );
  });

  const themeSwitch = (
    <div className="flex items-center gap-2.5">
      <Sun className="size-4 text-muted-foreground" aria-hidden="true" />
      <Switch
        checked={isDark}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      />
      <Moon className="size-4 text-muted-foreground" aria-hidden="true" />
    </div>
  );

  const authSection = user ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="group flex items-center gap-2 rounded-full py-1 pl-1 pr-2 transition-colors hover:bg-muted">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
            {getInitials(user.name)}
          </div>
          <span className="hidden max-w-[100px] truncate text-sm font-semibold sm:inline">{user.name}</span>
          <ChevronDown className="hidden h-3.5 w-3.5 text-muted-foreground transition-transform group-data-[state=open]:rotate-180 sm:inline" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col gap-0.5">
          <span className="text-sm font-semibold">{user.name}</span>
          <span className="truncate text-xs font-normal text-muted-foreground">{user.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="flex items-center justify-between px-2 py-2">
          <span className="text-sm font-medium">Theme</span>
          {themeSwitch}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={() => logOut()}
        >
          <LogOut className="h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        aria-label={isDark ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"}
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className="text-muted-foreground hover:text-foreground transition-transform active:scale-[0.96]"
      >
        {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </Button>
      <Button
        asChild
        size="sm"
        className="rounded-full px-4 text-xs font-bold transition-transform duration-150 ease-out active:scale-[0.97]"
      >
        <Link href="/login">Đăng nhập</Link>
      </Button>
    </div>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background backdrop-blur-xl backdrop-saturate-150">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="group flex min-h-11 items-center gap-2.5" aria-label="BusGo home">
            <Image
              src="/logo.png"
              alt="BusGo logo"
              width={36}
              height={36}
              priority
              className="h-9 w-9 transition-transform group-active:scale-[0.98]"
            />
            <span className="text-lg font-extrabold tracking-[-0.035em]">
              Bus<span className="text-primary">Go</span>
            </span>
          </Link>
          <nav aria-label="Primary" className="hidden items-center gap-6 md:flex">{navLinks}</nav>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden items-center md:flex">{authSection}</div>

          {/* Mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon-lg" className="md:hidden" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Image
                    src="/logo.png"
                    alt="BusGo logo"
                    width={32}
                    height={32}
                    className="h-8 w-8"
                  />
                  BusGo
                </SheetTitle>
              </SheetHeader>
              <nav aria-label="Mobile" className="mt-6 flex flex-col gap-1 px-4">
                {NAVIGATION.filter((item) => item.audience === "public" || isOperatorUser(user)).map((item) => {
                  const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors",
                        active
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
              <div className="mt-6 space-y-3 border-t border-border px-4 pt-6">
                {authSection}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
