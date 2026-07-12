// src/components/news/NewsSkeleton.jsx
//
// Place at: src/components/news/NewsSkeleton.jsx

const SkeletonCard = () => (
  <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden animate-pulse">
    <div className="aspect-[16/9] w-full bg-white/5" />
    <div className="p-5 space-y-3">
      <div className="h-4 w-20 rounded-full bg-white/10" />
      <div className="h-4 w-full rounded bg-white/10" />
      <div className="h-4 w-3/4 rounded bg-white/10" />
      <div className="h-3 w-full rounded bg-white/5" />
      <div className="h-3 w-2/3 rounded bg-white/5" />
    </div>
  </div>
);

const NewsSkeleton = ({ count = 6 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export default NewsSkeleton;
