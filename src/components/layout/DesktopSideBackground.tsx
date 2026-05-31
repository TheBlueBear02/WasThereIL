/** Soft primary-colored blobs in the viewport margins (md+); game column stays centered at 430px. */
export function DesktopSideBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 hidden overflow-hidden md:block"
      aria-hidden
    >
      <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.07] via-stone-50 to-primary-muted/25" />

      {/* Left margin */}
      <div
        className="absolute -left-20 top-[6%] h-80 w-80 rounded-[2.75rem] bg-primary/25 blur-[1px] motion-safe:animate-[side-blob-float_14s_ease-in-out_infinite]"
        style={{ animationDelay: '0s' }}
      />
      <div className="absolute left-[6%] top-[38%] h-44 w-64 rounded-full bg-primary-muted/45 motion-safe:animate-[side-blob-float_18s_ease-in-out_infinite_-3s]" />
      <div className="absolute left-[2%] bottom-[14%] h-56 w-40 rounded-[3rem] bg-primary/15 motion-safe:animate-[side-blob-float_16s_ease-in-out_infinite_-6s]" />
      <div className="absolute left-[14%] top-[22%] h-28 w-28 rounded-3xl border-[3px] border-primary/30 bg-white/40 motion-safe:animate-[side-blob-float_20s_ease-in-out_infinite_-2s]" />

      {/* Right margin */}
      <div
        className="absolute -right-24 top-[18%] h-96 w-72 rounded-[4rem] bg-primary/20 motion-safe:animate-[side-blob-float_17s_ease-in-out_infinite_-4s]"
        style={{ animationDelay: '-1s' }}
      />
      <div className="absolute right-[8%] top-[52%] h-52 w-52 rounded-full bg-primary/30 motion-safe:animate-[side-blob-float_15s_ease-in-out_infinite_-7s]" />
      <div className="absolute right-[3%] top-[8%] h-36 w-52 rounded-[2rem] bg-primary-muted/50 motion-safe:animate-[side-blob-float_19s_ease-in-out_infinite_-5s]" />
      <div className="absolute right-[16%] bottom-[20%] h-32 w-32 rounded-full border-4 border-primary-muted/60 bg-primary/[0.08] motion-safe:animate-[side-blob-float_22s_ease-in-out_infinite_-8s]" />

      {/* Pill accents hugging the center column */}
      <div className="absolute top-[72%] h-24 w-14 rounded-full bg-primary/20 motion-safe:animate-[side-blob-float_13s_ease-in-out_infinite_-2s] md:left-[calc(50%-215px-72px)]" />
      <div className="absolute top-[14%] h-20 w-12 rounded-full bg-primary-muted/40 motion-safe:animate-[side-blob-float_21s_ease-in-out_infinite_-9s] md:right-[calc(50%-215px-64px)]" />
    </div>
  )
}
