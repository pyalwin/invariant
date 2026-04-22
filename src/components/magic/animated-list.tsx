import { cn } from "@/lib/cn";

interface AnimatedListProps {
  children: React.ReactNode[];
  className?: string;
}

export function AnimatedList({ children, className }: AnimatedListProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {children.map((child, i) => (
        <div
          key={i}
          className="animate-slide-up rounded-lg border border-zinc-200 bg-zinc-50/80 p-4"
          style={{
            animation: `slideUp 0.25s ease-out both`,
            animationDelay: `${i * 60}ms`,
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}