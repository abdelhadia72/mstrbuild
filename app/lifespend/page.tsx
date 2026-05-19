import Image from "next/image";

export default function LifeSpend() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-24">
      <h1 className="max-w-3xl text-center text-5xl font-bold leading-[1.1] tracking-[-0.015em] sm:text-6xl md:text-7xl">
        That $30 isn&apos;t just money.
        <br />
        It&apos;s 1.5 hours of your life.
      </h1>

      <p className="mt-8 max-w-xl text-center text-lg leading-relaxed text-muted sm:text-xl">
        You don&apos;t have a spending problem; you have a perception problem.
        We instantly translate price tags into your actual Time Cost. See
        exactly how many hours you&apos;re trading away, hit a 15-minute pause,
        and stop buying things that aren&apos;t worth your time.
      </p>

      <div className="mt-16 w-full max-w-md">
        <div className="overflow-hidden rounded-[20px] border border-border/50 bg-white shadow-[0_8px_40px_rgba(0,0,0,0.08)] dark:bg-zinc-900 dark:shadow-[0_8px_40px_rgba(0,0,0,0.4)]">
          <Image
            src="/main.png"
            alt="LifeSpend app screenshot"
            width={896}
            height={600}
            className="w-full h-auto"
            priority
          />
        </div>
      </div>

      <div className="mt-16 flex w-full max-w-sm items-center gap-3">
        <input
          type="email"
          placeholder="Enter your email"
          className="h-12 flex-1 rounded-full border border-border bg-background px-5 text-[15px] text-foreground outline-none transition-all placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/20 dark:bg-zinc-900"
        />
        <button className="h-12 rounded-full bg-accent px-7 text-[15px] font-medium text-white transition-all hover:scale-[1.02] hover:brightness-110 active:scale-100">
          Join
        </button>
      </div>
    </main>
  );
}
