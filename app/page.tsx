import Image from "next/image";

const icons = [
  "/apps/1.png",
  "/apps/icnsFile_24bbd5c17a7ac627f32ac4759f4cdb36_Pages__Default___macOS_26.2___1024x1024x32.png",
  "/apps/icnsFile_6b23ea0b755112bbab4240742c448650_Sidebar_Calendar_1024x1024x32.png",
  "/apps/icnsFile_b6d8f3dcd5a0ebd866e3cdd5975f9df1_BrowserOS(1)_1024x1024x32.png",
  "/apps/icnsFile_b711634db00e82417124c500f58f9caa_vibe_1024x1024x32.png",
  "/apps/icnsFile_c97b38c83f563feda1ff7393029222ab_FlowJo__Default__1024x1024x32.png",
  "/apps/icnsFile_d0d1b57672295daa5098527729feff0b_Parallels_Desktop_1024x1024x32.png",
];

function MarqueeRow() {
  return (
    <div className="flex shrink-0 items-center gap-6 px-4">
      {icons.map((src, i) => (
        <div
          key={i}
          className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl sm:h-16 sm:w-16"
        >
          <Image
            src={src}
            alt=""
            width={64}
            height={64}
            className="h-full w-full object-cover"
          />
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-16 px-6">
      <div className="text-center">
        <h1 className="text-6xl font-bold leading-[1.1] tracking-[-0.02em] sm:text-7xl md:text-8xl">
          Master Build
        </h1>
        <p className="mt-6 text-xl text-muted sm:text-2xl">
          Let&apos;s build the future together.
        </p>
      </div>

      {/* HIDDEN: app icons marquee row — kept for future use
      <div className="w-full max-w-3xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div
          className="flex w-max"
          style={{
            animation: "marquee 20s linear infinite",
          }}
        >
          <MarqueeRow />
          <MarqueeRow />
        </div>
      </div>
      */}
    </main>
  );
}
