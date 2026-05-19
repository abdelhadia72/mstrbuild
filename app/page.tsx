import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6">
      <h1 className="text-6xl font-bold leading-[1.1] tracking-[-0.02em] sm:text-7xl md:text-8xl">
        Master Build
      </h1>
      <p className="mt-6 text-xl text-muted sm:text-2xl">
        Let&apos;s build the future together.
      </p>
      <Link
        href="/lifespend"
        className="mt-10 rounded-full bg-accent px-8 py-3.5 text-[15px] font-medium text-white transition-all hover:scale-[1.02] hover:brightness-110 active:scale-100"
      >
        LifeSpend
      </Link>
    </main>
  );
}
