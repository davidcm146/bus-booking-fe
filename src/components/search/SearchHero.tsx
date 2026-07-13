import Image from "next/image";
import { ShieldCheck, Headphones, Ticket, MapPin, ArrowDown } from "lucide-react";
import { SearchForm } from "./SearchForm";
import { PopularRoutes } from "./PopularRoutes";
import { VietnamMap } from "./VietnamMap";

export function SearchHero() {
  return (
    <div className="overflow-hidden">
      <section className="relative min-h-[520px] overflow-hidden sm:min-h-[600px] lg:min-h-[640px]">
        <Image
          src="/hero/vietnam-halong-bay.jpg"
          alt="Limestone karsts and islands in Ha Long Bay, Vietnam — scenic intercity bus travel destination"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(18,14,11,0.82)_0%,rgba(18,14,11,0.58)_46%,rgba(18,14,11,0.14)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(18,14,11,0.54)_0%,transparent_45%)]" />

        <div className="relative z-10 mx-auto flex min-h-[520px] w-full max-w-7xl items-center px-4 pb-20 pt-12 sm:min-h-[600px] sm:px-6 sm:pb-24 lg:min-h-[640px] lg:px-8">
          <div className="grid w-full items-center gap-12 md:grid-cols-[minmax(0,1fr)_300px] lg:gap-20">
            <div className="max-w-3xl">
              <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/15 px-3.5 py-2 text-xs font-semibold text-white backdrop-blur-md">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                200+ routes across Vietnam
              </span>

              <h1 className="max-w-3xl text-balance text-[clamp(2.75rem,7vw,5.5rem)] font-extrabold leading-[0.98] tracking-[-0.05em] text-white">
                Vietnam is closer
                <span className="block text-white/70">than it looks.</span>
              </h1>
              <p className="mt-5 max-w-xl text-pretty text-base leading-7 text-white/85 sm:text-lg">
                Compare trusted intercity coaches, see the full price, and choose the seat you actually want.
              </p>

              <div className="mt-6 flex flex-wrap gap-x-5 gap-y-3 text-xs font-semibold text-white/90 sm:text-sm">
                <span className="inline-flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Secure checkout
                </span>
                <span className="inline-flex items-center gap-2">
                  <Headphones className="h-3.5 w-3.5" />
                  24/7 support
                </span>
                <span className="inline-flex items-center gap-2">
                  <Ticket className="h-3.5 w-3.5" />
                  No hidden fees
                </span>
              </div>
            </div>

            <div className="hidden rounded-[2rem] border border-white/20 bg-black/25 p-6 text-white shadow-float backdrop-blur-md md:block">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-white/65">Live route network</p>
                  <p className="mt-1 text-2xl font-extrabold tracking-tight">14 cities</p>
                </div>
                <ArrowDown className="h-5 w-5 text-primary" />
              </div>
              <VietnamMap className="mx-auto mt-2 w-[150px]" />
              <p className="mt-1 text-center text-xs text-white/60">North to south, every day</p>
            </div>
          </div>
        </div>
      </section>

      <div className="relative z-20 mx-auto -mt-16 max-w-6xl px-4 sm:-mt-20 sm:px-6 lg:px-8">
        <SearchForm />
      </div>

      <PopularRoutes />
    </div>
  );
}
