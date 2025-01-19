import { cn } from "@/lib/utils";
import AnimatedGradientText from "@/components/ui/animated-gradient-text";

export default async function AnimatedGradientTextDemo() {
  return (
    <div className="z-10 flex items-center justify-center">
      <AnimatedGradientText>
        <div className="dot mr-2"></div>
        <span className="text-[#22B605]">
          Actuellement disponible
        </span>
      </AnimatedGradientText>
    </div>
  );
}
