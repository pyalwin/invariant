import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

interface NumberTickerProps {
  value: number;
  className?: string;
  delay?: number;
}

export function NumberTicker({ value, className, delay = 0 }: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const start = parseInt(el.textContent ?? "0", 10) || 0;
    const diff = value - start;
    if (diff === 0) return;

    let frame: number;
    const duration = 600;

    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = String(Math.round(start + diff * eased));
      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    };

    const timeout = setTimeout(() => {
      frame = requestAnimationFrame(animate);
    }, delay);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(frame);
    };
  }, [value, delay]);

  return (
    <span ref={ref} className={cn("font-mono tabular-nums", className)}>
      {value}
    </span>
  );
}