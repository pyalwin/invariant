// AnimatedBeam — draws animated connection lines between topic tree nodes.
// Used in Home.tsx to animate edges between prerequisite connections.
// Minimal SVG-based implementation.

interface Point {
  x: number;
  y: number;
}

interface AnimatedBeamProps {
  from: Point;
  to: Point;
  className?: string;
  color?: string;
}

export function AnimatedBeam({ from, to, className, color = "#4f6ef7" }: AnimatedBeamProps) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const cx1 = from.x + dx * 0.5;
  const cy1 = from.y;
  const cx2 = from.x + dx * 0.5;
  const cy2 = to.y;

  return (
    <svg
      className={className}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        overflow: "visible",
      }}
    >
      <defs>
        <linearGradient id={`grad-${color.replace("#", "")}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={color} stopOpacity="0" />
          <stop offset="50%" stopColor={color} stopOpacity="0.6" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Background static path */}
      <path
        d={`M ${from.x} ${from.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${to.x} ${to.y}`}
        fill="none"
        stroke={color}
        strokeWidth="1"
        strokeOpacity="0.15"
      />
      {/* Animated moving dot */}
      <circle r="2" fill={color}>
        <animateMotion
          dur="2.5s"
          repeatCount="indefinite"
          path={`M ${from.x} ${from.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${to.x} ${to.y}`}
        />
      </circle>
    </svg>
  );
}