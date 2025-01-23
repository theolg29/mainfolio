import { cn } from "@/lib/utils";
import Marquee from "@/components/ui/marquee";

const projects = [
  {
      name: "Ghz",
      img: "/thumbnails/ghz.png",
  },
  {
      name: "linkdup",
      img: "/thumbnails/linkdup.png",
  },
  {
      name: "omnivore",
      img: "/thumbnails/omnivore.png",
  },
  {
      name: "pinfig",
      img: "/thumbnails/pinfig.png",
  },
  {
      name: "placeholder",
      img: "/thumbnails/placeholder.png",
  },
  {
      name: "revixio",
      img: "/thumbnails/revixio.png",
  },
  {
      name: "scopeo",
      img: "/thumbnails/scopeo.png",
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
        "relative cursor-pointer overflow-hidden rounded-xl border p-4",
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
    <div className="full-width-marquee relative flex w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-background">
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