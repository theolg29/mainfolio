"use client";

import { motion, MotionValue, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import type { ComponentPropsWithoutRef, FC, ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface TextRevealProps extends ComponentPropsWithoutRef<"div"> {
  text: string;
}

export const TextReveal: FC<TextRevealProps> = ({ text, className }) => {
  const targetRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
  });
  const words = text.split(" ");

  return (
    <div ref={targetRef} className={cn("relative z-0 h-[200vh]", className)}>
      <div
        className={
          "sticky top-0 mx-auto flex h-[50%] max-w-4xl items-center bg-transparent px-[1rem] py-[5rem]"
        }
      >
        <p
          ref={targetRef}
          className={
            "flex flex-wrap p-5 !text-xl !font-bold md:p-8 md:!text-2xl lg:p-10 lg:!text-3xl xl:!text-4xl"
          }
        >
          {words.map((word, i) => {
            const start = i / words.length;
            const end = start + 1 / words.length;
            return (
              <Word key={i} progress={scrollYProgress} range={[start, end]}>
                {word}
              </Word>
            );
          })}
        </p>
      </div>
    </div>
  );
};

interface WordProps {
  children: ReactNode;
  progress: MotionValue<number>;
  range: [number, number];
}

const Word: FC<WordProps> = ({ children, progress, range }) => {
  const opacity = useTransform(progress, range, [0, 1]);
  const baseOpacity = useTransform(progress, range, [0.75, 0]);
  return (
    <span className="xl:lg-3 relative mx-1 lg:mx-2.5">
      <motion.span
        style={{ opacity: baseOpacity, color: "#666666" }}
        className={"absolute !font-bold"}
      >
        {children}
      </motion.span>
      <motion.span
        style={{ opacity: opacity, color: "#000000" }}
        className={"!font-bold"}
      >
        {children}
      </motion.span>
    </span>
  );
};
