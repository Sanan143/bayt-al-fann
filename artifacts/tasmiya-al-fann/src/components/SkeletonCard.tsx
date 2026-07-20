/**
 * SkeletonCard — shimmer loading placeholder that matches the ArtworkCard shape.
 * Use this while artworks are loading to prevent layout shift and improve perceived
 * performance.
 */
export function SkeletonCard() {
  return (
    <div
      className="rounded-2xl overflow-hidden bg-card border border-border/50 animate-pulse"
      role="status"
      aria-label="Loading artwork..."
      aria-busy="true"
    >
      {/* Image placeholder */}
      <div
        className="relative bg-muted shimmer"
        style={{ paddingBottom: "120%" }}
        aria-hidden="true"
      />

      {/* Info placeholder */}
      <div className="p-4 space-y-3">
        {/* Category label */}
        <div className="h-2.5 w-20 bg-muted rounded-full shimmer" aria-hidden="true" />
        {/* Title */}
        <div className="h-5 w-3/4 bg-muted rounded-full shimmer" aria-hidden="true" />
        {/* Medium */}
        <div className="h-3 w-1/2 bg-muted rounded-full shimmer" aria-hidden="true" />
        {/* Price + button row */}
        <div className="flex items-center justify-between pt-1">
          <div className="h-6 w-16 bg-muted rounded-full shimmer" aria-hidden="true" />
          <div className="h-7 w-24 bg-muted rounded-full shimmer" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}

/**
 * SkeletonGrid — renders N skeleton cards in a responsive grid.
 */
export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" aria-label="Loading artworks">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
