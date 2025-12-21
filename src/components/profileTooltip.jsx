"use client";
import React from "react";
import { AnimatedTooltip } from "@/components/ui/animated-tooltip";
import ProfilePicture from "@/assets/images/profile-picture.png";

const people = [
  {
    id: 1,
    name: "Théo Le Gourrierec",
    designation: "Designer UI / UX & Intégrateur web",
    image: ProfilePicture.src,
  },
];

export default function AnimatedTooltipPreview() {
  return (
    <div className="flex flex-row items-center justify-center">
      <AnimatedTooltip items={people} />
    </div>
  );
}
