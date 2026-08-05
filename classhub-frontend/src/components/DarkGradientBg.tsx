import type React from "react";

interface DarkGradientBgProps {
  children?: React.ReactNode;
  className?: string;
  intensity?: "strong" | "medium" | "subtle";
}

export function DarkGradientBg({
  children,
  className = "",
  intensity = "medium",
}: DarkGradientBgProps) {
  const streakOpacity =
    intensity === "strong"
      ? "opacity-25"
      : intensity === "medium"
        ? "opacity-15"
        : "opacity-[0.08]";

  const dotOpacity =
    intensity === "strong"
      ? "opacity-20"
      : intensity === "medium"
        ? "opacity-15"
        : "opacity-[0.08]";

  return (
    <div
      className={`relative min-h-screen w-full overflow-hidden bg-black ${className}`}
    >
      {/* Main dark gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(100% 100% at 0% 0%, rgb(46, 46, 46) 0%, rgb(0, 0, 0) 100%)",
            maskImage:
              "radial-gradient(125% 100% at 0% 0%, rgb(0, 0, 0) 0%, rgba(0, 0, 0, 0.224) 88.2883%, rgba(0, 0, 0, 0) 100%)",
            WebkitMaskImage:
              "radial-gradient(125% 100% at 0% 0%, rgb(0, 0, 0) 0%, rgba(0, 0, 0, 0.224) 88.2883%, rgba(0, 0, 0, 0) 100%)",
          }}
        >
          {/* Purple streak 1 */}
          <div
            className={`absolute inset-0 ${streakOpacity}`}
            style={{
              background:
                "linear-gradient(rgb(168, 85, 247) 0%, rgba(168, 85, 247, 0) 100%)",
              maskImage:
                "linear-gradient(90deg, transparent 0%, black 20%, transparent 36%, black 55%, transparent 67%, black 78%, transparent 97%)",
              WebkitMaskImage:
                "linear-gradient(90deg, transparent 0%, black 20%, transparent 36%, black 55%, transparent 67%, black 78%, transparent 97%)",
              transform: "skewX(45deg)",
            }}
          />

          {/* Purple streak 2 */}
          <div
            className={`absolute inset-0 ${streakOpacity}`}
            style={{
              background:
                "linear-gradient(rgb(147, 51, 234) 0%, rgba(147, 51, 234, 0) 100%)",
              maskImage:
                "linear-gradient(90deg, transparent 11%, black 25%, rgba(0,0,0,.55) 41%, transparent 67%, black 78%, transparent 97%)",
              WebkitMaskImage:
                "linear-gradient(90deg, transparent 11%, black 25%, rgba(0,0,0,.55) 41%, transparent 67%, black 78%, transparent 97%)",
              transform: "skewX(45deg)",
            }}
          />

          {/* Purple streak 3 */}
          <div
            className={`absolute inset-0 ${streakOpacity}`}
            style={{
              background:
                "linear-gradient(rgb(192, 132, 252) 0%, rgba(192, 132, 252, 0) 100%)",
              maskImage:
                "linear-gradient(90deg, transparent 9%, black 20%, rgba(0,0,0,.55) 28%, rgba(0,0,0,.42) 40%, black 48%, transparent 78%, black 88%, transparent 97%)",
              WebkitMaskImage:
                "linear-gradient(90deg, transparent 9%, black 20%, rgba(0,0,0,.55) 28%, rgba(0,0,0,.42) 40%, black 48%, transparent 78%, black 88%, transparent 97%)",
              transform: "skewX(45deg)",
            }}
          />
        </div>

        {/* Dot pattern */}
        <div
          className={`absolute inset-0 ${dotOpacity}`}
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.45) 1px, transparent 0)",
            backgroundSize: "20px 20px",
          }}
        />

        {/* Purple radial glow */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              "radial-gradient(circle at 20% 10%, rgba(168,85,247,0.22), transparent 38%)",
          }}
        />

        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Page content */}
      <div className="relative z-10 min-h-screen">
        {children}
      </div>
    </div>
  );
}