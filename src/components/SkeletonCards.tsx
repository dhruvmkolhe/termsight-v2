export function SkeletonCards() {
  return (
    <div className="space-y-4" aria-label="Analyzing contract" aria-busy="true">
      {[0, 1, 2].map((item) => (
        <div
          key={item}
          className="animate-pulse border-l-[6px] border-l-white/25 bg-[#F5F5F5] p-6 sm:p-8"
          style={{ animationDelay: `${item * 120}ms` }}
        >
          <div className="mb-5 h-7 w-32 rounded-full bg-black/15" />
          <div className="mb-4 h-8 w-2/3 bg-black/15" />
          <div className="mb-2 h-4 w-full bg-black/10" />
          <div className="mb-8 h-4 w-4/5 bg-black/10" />
          <div className="h-4 w-1/2 bg-black/10" />
        </div>
      ))}
    </div>
  );
}
