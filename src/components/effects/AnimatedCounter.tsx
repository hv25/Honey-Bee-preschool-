import React, { useState, useEffect, useRef } from "react";
import { useMotionValue, useSpring, motion, useTransform, useInView } from "motion/react";

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}

export default function AnimatedCounter({ value, suffix = "", prefix = "", duration = 2.0 }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const motionValue = useMotionValue(0);
  
  // Use a smooth spring animation for counts
  const springValue = useSpring(motionValue, {
    damping: 30,
    stiffness: 80,
    mass: 1
  });

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, value, motionValue]);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      setCurrent(Math.floor(latest));
    });
  }, [springValue]);

  return (
    <span ref={ref} className="font-display font-black tracking-tight inline-block">
      {prefix}
      {current}
      {suffix}
    </span>
  );
}
