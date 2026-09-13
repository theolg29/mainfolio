"use client";

import React, { useCallback, useEffect } from "react";
import { AnimatedTooltip } from "@/components/ui/animated-tooltip";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

interface ToolItem {
  id: number;
  name: string;
  designation: string;
  image: string;
  link?: string;
}

interface ToolsDockProps {
  items: ToolItem[];
  className?: string;
  gradientSize?: number;
  gradientFrom?: string;
  gradientTo?: string;
}

export const ToolsDock = ({
  items,
  className,
  gradientSize = 200,
  gradientFrom = "#000000",
  gradientTo = "#a3a3a3",
}: ToolsDockProps) => {
  const mouseX = useMotionValue(-gradientSize);
  const mouseY = useMotionValue(-gradientSize);

  const reset = useCallback(() => {
    mouseX.set(-gradientSize);
    mouseY.set(-gradientSize);
  }, [gradientSize, mouseX, mouseY]);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    },
    [mouseX, mouseY]
  );

  useEffect(() => {
    const handleGlobalPointerOut = (e: PointerEvent) => {
      if (!e.relatedTarget) reset();
    };

    window.addEventListener("pointerout", handleGlobalPointerOut);
    return () => {
      window.removeEventListener("pointerout", handleGlobalPointerOut);
    };
  }, [reset]);

  return (
    <div
      onPointerMove={handlePointerMove}
      onPointerLeave={reset}
      className={cn(
        "group relative flex rounded-xl border border-neutral-200 bg-transparent",
        className
      )}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px,
            ${gradientFrom}, 
            ${gradientTo}, 
            transparent 100%
            )
          `,
        }}
      />

      <div className="tools-dock-surface relative flex w-full flex-wrap justify-around gap-4 rounded-[11px] p-4 sm:flex-nowrap sm:gap-0 sm:px-4 sm:py-3">
        <AnimatedTooltip items={items} imageClassName="rounded-md" />
      </div>
    </div>
  );
};
