import React from "react";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg";
  showSubtitle?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = "md",
  showSubtitle = true,
  className = "",
}) => {
  const iconSizes = {
    sm: "w-7 h-7",
    md: "w-8.5 h-8.5",
    lg: "w-10 h-10",
  };

  const titleSizes = {
    sm: "text-base",
    md: "text-lg sm:text-xl",
    lg: "text-2xl",
  };

  return (
    <div className={`flex items-center gap-2.5 group hover:opacity-80 transition-opacity cursor-pointer ${className}`}>
      {/* Custom Geometric Concept A SVG Icon Box */}
      <div className={`relative ${iconSizes[size]} rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/35 transition-all duration-300 shrink-0`}>
        <div className="w-full h-full bg-zinc-950 rounded-[11px] flex items-center justify-center p-1.5 backdrop-blur-md">
          <svg
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full text-indigo-400 group-hover:scale-105 transition-transform duration-300"
          >
            <defs>
              <linearGradient id="chGradA" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                <stop stopColor="#818CF8" />
                <stop offset="0.5" stopColor="#6366F1" />
                <stop offset="1" stopColor="#22D3EE" />
              </linearGradient>
              <linearGradient id="chGradB" x1="0" y1="32" x2="32" y2="0" gradientUnits="userSpaceOnUse">
                <stop stopColor="#38BDF8" />
                <stop offset="1" stopColor="#818CF8" />
              </linearGradient>
            </defs>
            {/* Outer Stylized "C" Arc Layer */}
            <path
              d="M23 8.5C20.5 6.2 16.8 5.5 13 6.8C8.5 8.3 5.5 12.6 5.5 17.5C5.5 22.8 9.5 26.8 15 26.8C18.8 26.8 22.2 24.8 24 21.8"
              stroke="url(#chGradA)"
              strokeWidth="3.2"
              strokeLinecap="round"
            />
            {/* Overlapping Layered Notebook / Screen Mark inside "C" */}
            <path
              d="M13 11.5L22 11.5C23.1 11.5 24 12.4 24 13.5V19.5C24 20.6 23.1 21.5 22 21.5L13 21.5C11.9 21.5 11 20.6 11 19.5V13.5C11 12.4 11.9 11.5 13 11.5Z"
              fill="url(#chGradB)"
              fillOpacity="0.85"
            />
            {/* Glowing Accent Dot */}
            <circle cx="21.5" cy="10" r="2" fill="#22D3EE" />
          </svg>
        </div>
      </div>

      {/* Brand Text & Subtitle */}
      <div className="flex flex-col text-left justify-center leading-none">
        <div className={`font-bold tracking-tight ${titleSizes[size]} flex items-center gap-0.5`}>
          <span className="text-white">Class</span>
          <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-indigo-500 bg-clip-text text-transparent">
            Hub
          </span>
        </div>
        {showSubtitle && (
          <span className="text-[10px] tracking-widest text-zinc-500 font-semibold uppercase mt-0.5">
            VIRTUAL WORKSPACE
          </span>
        )}
      </div>
    </div>
  );
};
