import { cn } from "@/lib/utils";
import Marquee from "@/components/ui/marquee";

const projects = [
  {
      name: "bleep",
      img: "/thumbnails/bleep.png",
      link: "/projects/bleep"
  },
  {
      name: "ct-seo",
      img: "/thumbnails/ct-seo.png",
      link: "/projects/ct-seo"
  },
  {
      name: "kership",
      img: "/thumbnails/kership.png",
      link: "/projects/kership"
  },
  {
      name: "kult",
      img: "/thumbnails/kult.png",
      link: "/projects/kult"
  },
  {
      name: "mer-projets",
      img: "/thumbnails/mer-projets.png",
      link: "/projects/mer-projets"
  },
  {
      name: "onfido",
      img: "/thumbnails/onfido.png",
      link: "https://example.com/onfido"
  },
  {
      name: "pinfig",
      img: "/thumbnails/pinfig.png",
      link: "https://example.com/pinfig"
  },
  {
      name: "portfolio",
      img: "/thumbnails/placeholder.png",
      link: "/projects/portfolio"
  },
  {
      name: "revixio",
      img: "/thumbnails/revixio.png",
      link: "https://example.com/revixio"
  },
  {
      name: "solame",
      img: "/thumbnails/solame.png",
      link: "/projects/solame"
  },
  {
      name: "webdocmmi",
      img: "/thumbnails/webdocmmi.png",
      link: "/projects/webdocmmi"
  },
];

const row = projects.slice(0, projects.length / 2);

const ReviewCard = ({
  img,
  name,
  link,
}: {
  img: string;
  name: string;
  link: string;
}) => {
  return (
    <a href={link}>
      <figure
        className={cn(
          "relative cursor-pointer overflow-hidden rounded-xl border p-4",
          "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        )}
      >
        <div className="flex flex-row items-center gap-2">
          <img className="rounded-[11px]" width="300" height="350" alt={name} src={img} />
        </div>
      </figure>
    </a>
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