import React from "react";
import { motion } from "framer-motion";

const AnimatedTitle = () => {
  const words = [
    "Enchanté,",
    "je",
    "suis",
    "Théo,",
    "Designer",
    "&",
    "Développeur",
    "basé",
    "en",
    "Bretagne",
  ];

  return (
    <h1 className="mt-8 flex flex-wrap gap-2">
      {words.map((word, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 20, filter: "blur(5px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="inline-block"
        >
          {word}
        </motion.span>
      ))}
    </h1>
  );
};

export default AnimatedTitle;