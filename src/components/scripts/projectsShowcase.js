export function initProjectsShowcase() {
  const root = document.querySelector(".projects-showcase");
  if (!root) return;

  const items = Array.from(root.querySelectorAll(".showcase-item"));
  const medias = Array.from(root.querySelectorAll(".showcase-media-item"));
  if (!items.length || !medias.length) return;

  const setActive = (id) => {
    items.forEach((item) => {
      item.classList.toggle("active", item.dataset.project === id);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActive(entry.target.dataset.project);
        }
      });
    },
    { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
  );

  medias.forEach((media) => observer.observe(media));

  items.forEach((item) => {
    const trigger = item.querySelector(".showcase-item-title");
    trigger?.addEventListener("click", () => {
      const target = medias.find(
        (media) => media.dataset.project === item.dataset.project
      );
      target?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  });

  setActive(items[0]?.dataset.project);
}
