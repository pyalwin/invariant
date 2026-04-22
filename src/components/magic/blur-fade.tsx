import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

interface BlurFadeProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export function BlurFade({ children, delay = 0, className }: BlurFadeProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div
      className={cn(
        "transition-all duration-300",
        visible ? "opacity-100 blur-0" : "opacity-0 blur-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}