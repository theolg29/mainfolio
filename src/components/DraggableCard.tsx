import { motion } from "framer-motion";
import React, { useState, useRef } from "react";

interface DraggableCardProps {
  children: any;
  className?: string;
  initialRotation?: number;
}

let globalZIndex = 1;

export default function DraggableCard({
  children,
  className = "",
  initialRotation = 0,
}: DraggableCardProps) {
  const [zIndex, setZIndex] = useState(1);
  const [isDragging, setIsDragging] = useState(false);

  const bringToFront = () => {
    globalZIndex += 1;
    setZIndex(globalZIndex);
  };

  return (
    <motion.div
      className={className}
      drag
      dragConstraints={{ left: -150, right: 150, top: -100, bottom: 100 }}
      dragElastic={0.2}
      dragMomentum={false}
      dragTransition={{
        bounceStiffness: 300,
        bounceDamping: 20,
        power: 0.2,
        timeConstant: 150,
      }}
      initial={{ rotate: initialRotation }}
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.15, ease: "easeOut" },
      }}
      whileDrag={{
        scale: 1.05,
        rotate: 0,
        transition: { duration: 0.1 },
      }}
      style={{
        cursor: "grab",
        userSelect: "none",
        willChange: "transform",
        zIndex: isDragging ? zIndex + 1000 : zIndex,
      }}
      onDragStart={() => {
        setIsDragging(true);
        bringToFront();
        document.body.style.cursor = "grabbing";
      }}
      onDragEnd={() => {
        setIsDragging(false);
        document.body.style.cursor = "default";
      }}
    >
      {children}
    </motion.div>
  );
}
