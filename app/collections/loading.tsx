import { PublicNavigation } from "@/components/PublicNavigation";

export default function CollectionsLoading() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#e6e7e2] text-[#121211]">
      <PublicNavigation />

      <section aria-label="Loading collection" className="mx-auto min-h-screen max-w-[1500px] px-5 pb-16 pt-28 lg:px-12">
        <div className="h-16 w-1/3 animate-pulse bg-black/[0.045]" />
        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[0, 1, 2, 3].map((item) => (
            <div className="aspect-[4/5] animate-pulse bg-black/[0.045]" key={item} />
          ))}
        </div>
      </section>
    </main>
  );
}
