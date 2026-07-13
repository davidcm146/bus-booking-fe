import Link from "next/link";
import { MapPinned, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70dvh] max-w-3xl flex-col items-center justify-center px-4 py-16 text-center">
      <span className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-light text-primary">
        <MapPinned className="h-9 w-9" />
      </span>
      <p className="mt-6 text-sm font-bold text-primary">Route 404</p>
      <h1 className="mt-2 text-balance text-4xl font-extrabold tracking-[-0.045em] sm:text-5xl">This stop is not on our map.</h1>
      <p className="mt-4 max-w-lg text-pretty leading-7 text-muted-foreground">The page may have moved, or the link may be incomplete. Start a new search to get back on the right route.</p>
      <Button asChild size="lg" className="mt-8">
        <Link href="/">
          <ArrowLeft className="h-4 w-4" />
          Back to bus search
        </Link>
      </Button>
    </div>
  );
}
