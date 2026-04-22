import { cn } from "@/lib/cn";

interface MarqueeProps {
  items: string[];
  className?: string;
}

export function Marquee({ items, className }: MarqueeProps) {
  return (
    <div
      className={cn(
        "relative flex overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50/80 py-2 before:absolute before:left-0 before:top-0 before:z-10 before:h-full before:w-12 before:bg-gradient-to-r before:from-zinc-900/90 before:to-transparent after:absolute after:right-0 after:top-0 after:z-10 after:h-full after:w-12 after:bg-gradient-to-l after:from-zinc-900/90 after:to-transparent",
        className,
      )}
    >
      <div
        className="animate-marquee flex gap-8 whitespace-nowrap"
        style={{
          animation: `marquee 20s linear infinite`,
        }}
      >
        {[...items, ...items].map((item, i) => (
          <span key={i} className="text-xs text-zinc-600">
            {item}
          </span>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}