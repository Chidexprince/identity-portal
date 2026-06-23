/**
 * Skeleton loading components for the identity directory feature.
 *
 * Skeletons improve perceived performance by showing the expected page shape
 * while TanStack Query is fetching data from the BFF.
 */

export function IdentityDirectorySkeleton() {
  return (
    <div
      className="grid grid-cols-1 gap-4 sm:grid-cols-2"
      aria-label="Loading identity directory"
    >
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 animate-pulse rounded-full bg-slate-200" />

            <div className="min-w-0 flex-1 space-y-3">
              <div className="h-4 w-3/4 animate-pulse rounded-full bg-slate-200" />
              <div className="h-3 w-1/2 animate-pulse rounded-full bg-slate-100" />
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <div className="h-6 w-16 animate-pulse rounded-full bg-slate-100" />
            <div className="h-6 w-24 animate-pulse rounded-full bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function IdentityDetailSkeleton() {
  return (
    <div className="space-y-6" aria-label="Loading identity details">
      <div className="flex items-center gap-4">
        <div className="h-20 w-20 animate-pulse rounded-full bg-slate-200" />

        <div className="flex-1 space-y-3">
          <div className="h-5 w-2/3 animate-pulse rounded-full bg-slate-200" />
          <div className="h-4 w-1/2 animate-pulse rounded-full bg-slate-100" />
        </div>
      </div>

      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center justify-between rounded-2xl bg-slate-50 p-4"
          >
            <div className="h-4 w-24 animate-pulse rounded-full bg-slate-200" />
            <div className="h-4 w-28 animate-pulse rounded-full bg-slate-100" />
          </div>
        ))}
      </div>
    </div>
  );
}
