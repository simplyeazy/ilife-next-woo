export function FeaturedProductsSkeleton() {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-5xl mx-auto px-6">
        {/* Centered title with decorative underline */}
        <div className="text-center mb-10">
          <div className="h-9 w-48 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-4 animate-pulse" />
          <div className="w-12 h-0.5 bg-gray-300 dark:bg-gray-600 mx-auto animate-pulse" />
        </div>

        {/* Masonry grid skeleton: first 2 wide, rest narrow */}
        <div className="grid grid-cols-1 sm:grid-cols-6 gap-3">
          {[...Array(8)].map((_, i) => {
            const isWide = i < 2;
            return (
              <div
                key={i}
                className={[
                  "relative overflow-hidden rounded-lg",
                  isWide ? "sm:col-span-3 aspect-[16/10]" : "sm:col-span-2 aspect-[4/3]",
                ].join(" ")}
              >
                <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
                {/* Caption overlay skeleton */}
                <div className="absolute bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 px-4 py-2.5 flex items-center gap-2.5">
                  <div className="h-5 w-16 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
                  <div className="h-4 w-24 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
                </div>
              </div>
            );
          })}
        </div>

        {/* "Lihat Semua" button skeleton */}
        <div className="mt-8 text-center">
          <div className="h-10 w-36 bg-gray-200 dark:bg-gray-700 rounded-full inline-block animate-pulse" />
        </div>
      </div>
    </section>
  );
}