import { cn } from "@/lib/utils";
import Marquee from "@/components/ui/marquee";

const projects = [
    {
        name: "Ghz",
        img: "/src/assets/images/thumbnails/ghz.png",
    },
    {
        name: "linkdup",
        img: "/src/assets/images/thumbnails/linkdup.png",
    },
    {
        name: "omnivore",
        img: "/src/assets/images/thumbnails/omnivore.png",
    },
    {
        name: "pinfig",
        img: "/src/assets/images/thumbnails/pinfig.png",
    },
    {
        name: "placeholder",
        img: "/src/assets/images/thumbnails/placeholder.png",
    },
    {
        name: "revixio",
        img: "/src/assets/images/thumbnails/revixio.png",
    },
    {
        name: "scopeo",
        img: "/src/assets/images/thumbnails/scopeo.png",
    },
];

const row = projects.slice(0, projects.length / 2);

const ReviewCard = ({
  img,
  name,
}: {
  img: string;
  name: string;
}) => {
  return (
    <figure
      className={cn(
        "relative cursor-pointer mt-12 overflow-hidden rounded-xl border p-4",
        // light styles
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        // dark styles
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <img  width="300" height="350" alt="" src={img} />
      </div>
    </figure>
  );
};

export default function MarqueeDemo() {
  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-background">
      <Marquee pauseOnHover className="[--duration:20s]">
        {row.map((review) => (
          <ReviewCard key={review.img} {...review} />
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-background"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-background"></div>
    </div>
  );
}