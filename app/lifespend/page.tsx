import Image from "next/image";
import Countdown from "./countdown";
import WaitlistForm from "./waitlist-form";

export default function LifeSpend() {
  return (
    <main className="relative flex h-dvh flex-col items-center justify-between px-6 py-10 text-[#f5f5f7] overflow-hidden" style={{ background: "radial-gradient(ellipse at 50% 0%, #1a1a1e 0%, #0a0a0b 60%)" }}>
      <div className="flex flex-1 flex-col items-center justify-center gap-6">
        <h1 className="max-w-4xl text-center text-[34px] font-semibold leading-[1.12] tracking-[-0.02em] sm:text-[42px] md:text-[50px]">
          That $30 isn&apos;t just money.
          <br />
          It&apos;s 1.5 hours of your life.
        </h1>

        <Countdown />

        <WaitlistForm />
      </div>

      <div className="flex w-full items-end justify-center gap-2 sm:gap-4">
        <div className="relative w-[150px] sm:w-[225px] overflow-hidden rounded-[26px]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 mt-2 h-[22px] w-[74px] rounded-full bg-black z-10" />
          <Image src="/lifespend/Group 17.png" alt="" width={896} height={600} className="w-full h-auto" />
        </div>

        <div className="relative w-[150px] sm:w-[225px] overflow-hidden rounded-[26px] shadow-[0_16px_60px_rgba(0,0,0,0.5)]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 mt-2 h-[22px] w-[74px] rounded-full bg-black z-10" />
          <Image src="/lifespend/main.PNG" alt="LifeSpend app screenshot" width={896} height={600} className="w-full h-auto" priority />
        </div>

        <div className="relative w-[150px] sm:w-[225px] overflow-hidden rounded-[26px]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 mt-2 h-[22px] w-[74px] rounded-full bg-black z-10" />
          <Image src="/lifespend/IMG_9034.PNG" alt="" width={896} height={600} className="w-full h-auto" />
        </div>
      </div>
    </main>
  );
}
