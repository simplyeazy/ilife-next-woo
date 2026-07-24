export function AboutSkeleton() {
  return (
    <section className="md:py-12 py-16">
      <div className="max-w-5xl mx-auto px-6">
        {/* Centered heading with separator */}
        <div className="text-center mb-12">
          <div className="h-9 w-3/5 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-4 animate-pulse" />
          <div className="w-12 h-0.5 bg-gray-300 dark:bg-gray-600 mx-auto animate-pulse" />
        </div>

        {/* Two-column body */}
        <div className="grid md:grid-cols-2 gap-12">
          {/* Left: intro + checkmarks */}
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-4 w-11/12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-4 w-4/5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
            <ul className="space-y-4 pt-4">
              {[...Array(4)].map((_, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded shrink-0 mt-0.5 animate-pulse" />
                  <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </li>
              ))}
            </ul>
          </div>

          {/* Right: company description + CTA */}
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-4 w-11/12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-4 w-4/5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
            <div className="h-10 w-40 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse mt-8" />
          </div>
        </div>
      </div>
    </section>
  );
}