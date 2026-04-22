import { cn } from "@/lib/cn";

interface BorderBeamProps {
  className?: string;
  children: React.ReactNode;
}

export function BorderBeam({ className, children }: BorderBeamProps) {
  return (
    <div
      className={cn(
        "relative rounded-xl border border-zinc-300/50 bg-zinc-50/80 shadow-xl backdrop-blur-sm",
        "before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-r before:from-indigo-500/10 before:via-purple-500/5 before:to-indigo-500/10",
        className,
      )}
    >
      {children}
    </div>
  );
}