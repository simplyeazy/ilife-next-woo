export function MerekProdukSkeleton() {
  return (
    <section className="py-16">
      <div className="max-w-5xl mx-auto px-6">
        {/* Centered title */}
        <div className="text-center mb-10">
          <div className="h-9 w-72 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-4 animate-pulse" />
          <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mx-auto animate-pulse" />
          <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded mx-auto mt-2 animate-pulse" />
        </div>

        {/* Brand logos row */}
        <div className="flex flex-wrap justify-center items-center gap-12">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="w-[120px] h-[64px] bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
            />
          ))}
        </div>
      </div>
    </section>
  );
}