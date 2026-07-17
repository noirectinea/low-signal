export default function Loading() {
  return (
    <main
      aria-busy="true"
      aria-live="polite"
      className="grid min-h-screen place-items-center bg-[#e5e6e1] px-5 text-[#121211]"
    >
      <div className="w-full max-w-[520px] border-y border-black/16 py-10 text-[10px] uppercase tracking-[0.16em] text-black/54">
        <div className="h-px w-12 animate-pulse bg-black/36" />
        <p className="mt-7">Loading LOW SIGNAL.</p>
      </div>
    </main>
  );
}
