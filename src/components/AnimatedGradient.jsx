import { useMemo, useRef } from "react";
import { useDimensions } from "./hooks/useDimensions";

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export default function AnimatedGradient({ colors, speed = 5, blur = "light" }) {
  const containerRef = useRef(null);
  const dimensions = useDimensions(containerRef);
  const circleSize = useMemo(
    () => Math.max(dimensions.width, dimensions.height),
    [dimensions.width, dimensions.height]
  );

  const blurClass =
    blur === "light" ? "blur-2xl" : blur === "medium" ? "blur-3xl" : "blur-[100px]";

  // Memoize all random values so they don't change on re-render
  const circles = useMemo(
    () =>
      colors.map(() => ({
        top: `${Math.random() * 50}%`,
        left: `${Math.random() * 50}%`,
        tx1: Math.random() - 0.5,
        ty1: Math.random() - 0.5,
        tx2: Math.random() - 0.5,
        ty2: Math.random() - 0.5,
        tx3: Math.random() - 0.5,
        ty3: Math.random() - 0.5,
        tx4: Math.random() - 0.5,
        ty4: Math.random() - 0.5,
        sizeMult: randomInt(5, 15) / 10,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [colors.length]
  );

  return (
    <div ref={containerRef} className="fixed inset-0 overflow-hidden -z-10">
      <div className={`absolute inset-0 ${blurClass}`}>
        {colors.map((color, i) => (
          <svg
            key={i}
            className="absolute animate-background-gradient"
            style={{
              top: circles[i].top,
              left: circles[i].left,
              "--background-gradient-speed": `${1 / speed}s`,
              "--tx-1": circles[i].tx1,
              "--ty-1": circles[i].ty1,
              "--tx-2": circles[i].tx2,
              "--ty-2": circles[i].ty2,
              "--tx-3": circles[i].tx3,
              "--ty-3": circles[i].ty3,
              "--tx-4": circles[i].tx4,
              "--ty-4": circles[i].ty4,
            }}
            width={circleSize * circles[i].sizeMult}
            height={circleSize * circles[i].sizeMult}
            viewBox="0 0 100 100"
          >
            <circle cx="50" cy="50" r="50" fill={color} className="opacity-30 dark:opacity-[0.15]" />
          </svg>
        ))}
      </div>
    </div>
  );
}
