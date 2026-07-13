import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-muted/55">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="max-w-sm">
            <Link href="/" className="inline-flex items-center gap-2.5 font-extrabold tracking-[-0.03em]">
              <Image
                src="/logo.png"
                alt="BusGo logo"
                width={36}
                height={36}
                className="h-9 w-9"
              />
              BusGo
            </Link>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              Compare verified intercity coaches, choose your seat, and keep every ticket in one place.
            </p>
          </div>

          <nav aria-label="Plan your trip">
            <p className="text-sm font-bold">Plan your trip</p>
            <div className="mt-3 flex flex-col items-start gap-2 text-sm text-muted-foreground">
              <Link href="/" className="min-h-8 transition-colors hover:text-foreground">Find a bus</Link>
              <Link href="/bookings" className="min-h-8 transition-colors hover:text-foreground">Manage bookings</Link>
              <Link href="/login" className="min-h-8 transition-colors hover:text-foreground">Sign in</Link>
            </div>
          </nav>

          <div>
            <p className="text-sm font-bold">Need help?</p>
            <div className="mt-3 space-y-3 text-sm text-muted-foreground">
              <a href="mailto:support@busgo.app" className="flex min-h-8 items-center gap-2 transition-colors hover:text-foreground">
                <Mail className="h-4 w-4 text-primary" />
                support@busgo.app
              </a>
              <p className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                Routes across Vietnam
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} BusGo</p>
          <p>Privacy and terms pages are being prepared before public launch.</p>
        </div>
      </div>
    </footer>
  );
}
