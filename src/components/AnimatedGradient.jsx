import { useMemo, useRef } from "react";
import { useDimensions } from "./hooks/useDimensions";

const randomFloat = () => Math.random() - 0.5;
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export default function AnimatedGradient({ colors, speed = 5, blur = "heavy" }) {
  const containerRef = useRef(null);
  const dimensions = useDimensions(containerRef);
  const circleSize = useMemo(
    () => Math.max(dimensions.width, dimensions.height),
    [dimensions.width, dimensions.height]
  );

  const blurClass = blur === "light" ? "blur-2xl" : blur === "medium" ? "blur-3xl" : "blur-[100px]";

  const circles = useMemo(
    () =>
      colors.map(() => ({
        top: `${Math.random() * 50}%`,
        left: `${Math.random() * 50}%`,
        tx1: randomFloat(), ty1: randomFloat(),
        tx2: randomFloat(), ty2: randomFloat(),
        tx3: randomFloat(), ty3: randomFloat(),
        tx4: randomFloat(), ty4: randomFloat(),
        sizeMult: randomInt(5, 15) / 10,
      })),
    [colors]
  );

  return (
    <div ref={containerRef} className="fixed inset-0 overflow-hidden -z-10">
      <div className={`absolute inset-0 ${blurClass}`}>
        {colors.map((color, i) => (
          <svg
            key={i}
            className="absolute animate-gradient-drift"
            style={{
              top: circles[i].top,
              left: circles[i].left,
              "--gradient-speed": `${1 / speed}s`,
              "--tx-1": circles[i].tx1,
              "--ty-1": circles[i].ty1,
              "--tx-2": circles[i].tx2,
              "--ty-2": circles[i].ty2,
              "--tx-3": circles[i].tx3,
              "--ty-3": circles[i].ty3,
            }}
            width={circleSize * circles[i].sizeMult}
            height={circleSize * circles[i].sizeMult}
            viewBox="0 0 100 100"
          >
            <circle cx="50" cy="50" r="50" fill={color} opacity="0.15" />
          </svg>
        ))}
      </div>
    </div>
  );
}
