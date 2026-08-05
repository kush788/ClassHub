import React from "react";

interface SkeletonCardProps {
  className?: string;
}

const SkeletonCard: React.FC<SkeletonCardProps> = ({
  className = "",
}) => {
  return (
    <div
      className={`animate-pulse rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 ${className}`}
    >
      <div className="mb-5 flex items-center gap-4">
        <div className="h-12 w-12 rounded-xl bg-zinc-800" />

        <div className="flex-1">
          <div className="h-4 w-1/3 rounded bg-zinc-800" />
          <div className="mt-3 h-3 w-1/2 rounded bg-zinc-800/80" />
        </div>
      </div>

      <div className="space-y-3">
        <div className="h-3 w-full rounded bg-zinc-800/80" />
        <div className="h-3 w-5/6 rounded bg-zinc-800/80" />
        <div className="h-3 w-2/3 rounded bg-zinc-800/80" />
      </div>
    </div>
  );
};

export default SkeletonCard;