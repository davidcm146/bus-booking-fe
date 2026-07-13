import Image from "next/image";
import { BENEFITS } from "@/lib/constants";

interface AuthShellProps {
  readonly children: React.ReactNode;
}

export function AuthShell({ children }: AuthShellProps) {
  return (
    <div className="mx-auto grid min-h-[calc(100dvh-72px)] max-w-7xl lg:grid-cols-[1.05fr_0.95fr]">
      <section className="relative hidden min-h-[680px] overflow-hidden lg:block">
        <Image
          src="/hero/vietnam-halong-bay.jpg"
          alt="Ha Long Bay in northern Vietnam"
          fill
          sizes="55vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(19,14,11,0.88)_0%,rgba(19,14,11,0.18)_78%)]" />
        <div className="absolute inset-x-0 bottom-0 p-10 text-white xl:p-14">
          <p className="text-sm font-bold text-white/70">Travel account</p>
          <h1 className="mt-3 max-w-xl text-5xl font-extrabold leading-[1.02] tracking-[-0.045em]">
            Your next route stays within reach.
          </h1>
          <div className="mt-8 grid gap-3">
            {BENEFITS.map(({ icon: Icon, label }) => (
              <p key={label} className="flex items-center gap-3 text-sm font-semibold text-white/85">
                <Icon className="h-4 w-4 text-primary" />
                {label}
              </p>
            ))}
          </div>
        </div>
      </section>
      <section className="flex items-center justify-center bg-muted/45 px-4 py-12 sm:px-8 lg:bg-background lg:px-12">
        {children}
      </section>
    </div>
  );
}
